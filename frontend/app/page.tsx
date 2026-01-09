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
  alpha,
} from '@mui/material';
import { Search as SearchIcon, Radar, FlightTakeoff } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getForecast } from '@/lib/api/weatherApi';
import { getDrones } from '@/lib/api/dronesApi';
import SafetyIndicator from '@/components/weather/SafetyIndicator';
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherTimeline from '@/components/weather/WeatherTimeline';
import SafeWindowsList from '@/components/weather/SafeWindowsList';
import SafetyDetails from '@/components/weather/SafetyDetails';
import { colors } from '@/theme/theme';

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
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
          p: 4,
          background: `linear-gradient(135deg, ${colors.background.tertiary} 0%, ${colors.background.secondary} 100%)`,
          border: `1px solid ${colors.border.default}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${colors.accent.primary}, transparent)`,
          },
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(${alpha(colors.accent.primary, 0.02)} 1px, transparent 1px),
              linear-gradient(90deg, ${alpha(colors.accent.primary, 0.02)} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }}
        />

        {/* Glowing orb */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(colors.accent.primary, 0.1)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 30px ${alpha(colors.accent.primary, 0.3)}`,
              }}
            >
              <Radar sx={{ fontSize: 24, color: colors.background.primary }} />
            </Box>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: colors.accent.primary,
                  fontSize: '0.65rem',
                }}
              >
                FLIGHT CHECK SYSTEM
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: colors.text.primary,
                  lineHeight: 1.2,
                }}
              >
                Проверка условий полёта
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              maxWidth: 600,
              mb: 3,
            }}
          >
            Получите мгновенную оценку безопасности на основе текущей погоды и прогноза
            для планирования безопасных полётов дронов
          </Typography>

          {/* Quick stats */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Точность', value: '99.2%' },
              { label: 'Источников', value: '12+' },
              { label: 'Обновление', value: '< 1s' },
            ].map((stat, i) => (
              <Box key={i}>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: colors.accent.primary,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: colors.text.muted, fontSize: '0.65rem' }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Search Form Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FlightTakeoff sx={{ fontSize: 20, color: colors.accent.primary }} />
            <Typography
              variant="overline"
              sx={{ color: colors.text.muted, fontSize: '0.65rem' }}
            >
              ПАРАМЕТРЫ ПРОВЕРКИ
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: drone.status === 'active' ? colors.safety.green : colors.safety.yellow,
                          }}
                        />
                        {drone.name} ({drone.model})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Координаты (lat, lon)"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="55.75, 37.62"
                InputProps={{
                  sx: {
                    fontFamily: '"JetBrains Mono", monospace',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Прогноз</InputLabel>
                <Select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value as 1 | 3 | 6)}
                  label="Прогноз"
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
                startIcon={isLoading ? <CircularProgress size={18} sx={{ color: colors.background.primary }} /> : <SearchIcon />}
                onClick={handleCheck}
                disabled={!selectedDrone || isLoading}
                sx={{ height: '56px' }}
              >
                {isLoading ? 'Анализ...' : 'Проверить'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке данных о погоде. Пожалуйста, попробуйте снова.
        </Alert>
      )}

      {/* Results */}
      {weatherData && (
        <Box>
          {/* Results header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: colors.safety.green,
                boxShadow: `0 0 10px ${colors.safety.green}`,
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
            <Typography
              variant="overline"
              sx={{ color: colors.text.muted, fontSize: '0.65rem' }}
            >
              РЕЗУЛЬТАТЫ АНАЛИЗА
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography
              variant="caption"
              sx={{
                color: colors.text.muted,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {new Date().toLocaleString('ru-RU')}
            </Typography>
          </Box>

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
        </Box>
      )}

      {/* Empty state */}
      {!weatherData && !isLoading && checkTriggered === false && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            borderRadius: 3,
            border: `1px dashed ${colors.border.muted}`,
            backgroundColor: alpha(colors.background.tertiary, 0.3),
          }}
        >
          <Radar
            sx={{
              fontSize: 48,
              color: colors.text.muted,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography
            variant="h6"
            sx={{ color: colors.text.secondary, mb: 1 }}
          >
            Выберите параметры для проверки
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colors.text.muted, maxWidth: 400, mx: 'auto' }}
          >
            Укажите дрон и координаты, чтобы получить оценку безопасности полёта
            на основе текущих погодных условий
          </Typography>
        </Box>
      )}
    </Box>
  );
}
