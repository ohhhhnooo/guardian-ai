'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather, getForecast } from '@/lib/api/weatherApi';
import { getDrones } from '@/lib/api/dronesApi';
import SafetyIndicator from '@/components/weather/SafetyIndicator';
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherTimeline from '@/components/weather/WeatherTimeline';
import SafeWindowsList from '@/components/weather/SafeWindowsList';
import SafetyDetails from '@/components/weather/SafetyDetails';

export default function HomePage() {
  const [selectedDrone, setSelectedDrone] = useState<string>('');
  const [location, setLocation] = useState({ lat: 55.75, lon: 37.62 });
  const [locationInput, setLocationInput] = useState('55.75, 37.62');
  const [timeWindow, setTimeWindow] = useState<1 | 3 | 6>(6);
  const [checkTriggered, setCheckTriggered] = useState(false);

  const { data: drones } = useQuery({
    queryKey: ['drones'],
    queryFn: getDrones,
  });

  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weather', location.lat, location.lon, selectedDrone, timeWindow],
    queryFn: () => getForecast(location.lat, location.lon, timeWindow, selectedDrone),
    enabled: checkTriggered && !!selectedDrone,
  });

  const handleCheck = () => {
    const [lat, lon] = locationInput.split(',').map((s) => parseFloat(s.trim()));
    if (!isNaN(lat) && !isNaN(lon)) {
      setLocation({ lat, lon });
      setCheckTriggered(true);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Проверка условий полёта
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Получите рекомендации на основе текущей погоды и прогноза для безопасного планирования полётов
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Выберите дрон</InputLabel>
                <Select
                  value={selectedDrone}
                  onChange={(e) => setSelectedDrone(e.target.value)}
                  label="Выберите дрон"
                >
                  {drones?.map((drone) => (
                    <MenuItem key={drone.id} value={drone.id}>
                      {drone.name} ({drone.model})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Локация (lat, lon)"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="55.75, 37.62"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Окно времени</InputLabel>
                <Select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value as 1 | 3 | 6)}
                  label="Окно времени"
                >
                  <MenuItem value={1}>1 час</MenuItem>
                  <MenuItem value={3}>3 часа</MenuItem>
                  <MenuItem value={6}>6 часов</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                onClick={handleCheck}
                disabled={!selectedDrone || isLoading}
                sx={{ height: '56px' }}
              >
                Проверить
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке данных о погоде
        </Alert>
      )}

      {weatherData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SafetyIndicator
              safetyIndex={weatherData.current.safety_index}
              safetyClass={weatherData.current.safety_class}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <WeatherCard weather={weatherData.current} />
          </Grid>
          <Grid item xs={12} md={4}>
            <SafetyDetails weather={weatherData.current} />
          </Grid>
          <Grid item xs={12}>
            <WeatherTimeline forecast={weatherData.forecast} />
          </Grid>
          {weatherData.safe_windows && weatherData.safe_windows.length > 0 && (
            <Grid item xs={12}>
              <SafeWindowsList windows={weatherData.safe_windows} />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

