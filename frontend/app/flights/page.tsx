'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FlightTakeoff, Route } from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getDrones } from '@/lib/api/dronesApi';
import { planFlight } from '@/lib/api/flightsApi';
import { FlightPlan } from '@/types/domain';
import RouteSummaryCard from '@/components/flights/RouteSummaryCard';
import RouteMap from '@/components/flights/RouteMap';
import MicroclimateMap from '@/components/weather/MicroclimateMap';

export default function FlightsPage() {
  const [selectedDrone, setSelectedDrone] = useState<string>('');
  const [location, setLocation] = useState({ lat: 55.75, lon: 37.62 });
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [plannedRoute, setPlannedRoute] = useState<FlightPlan | null>(null);

  const { data: drones } = useQuery({
    queryKey: ['drones'],
    queryFn: getDrones,
  });

  const planMutation = useMutation({
    mutationFn: planFlight,
    onSuccess: (data) => {
      setPlannedRoute(data);
    },
  });

  const handlePlan = () => {
    if (!selectedDrone || !startTime) {
      return;
    }
    planMutation.mutate({
      drone_id: selectedDrone,
      location,
      planned_start: startTime,
      duration_minutes: duration,
      mode,
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Планирование полётов
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Параметры полёта
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Время старта"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Длительность (минуты)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Режим планирования</FormLabel>
                    <RadioGroup
                      value={mode}
                      onChange={(e) => setMode(e.target.value as 'auto' | 'manual')}
                    >
                      <FormControlLabel
                        value="auto"
                        control={<Radio />}
                        label="Автопланировщик (рекомендуется)"
                      />
                      <FormControlLabel value="manual" control={<Radio />} label="Ручной маршрут" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={planMutation.isPending ? <CircularProgress size={20} /> : <Route />}
                    onClick={handlePlan}
                    disabled={!selectedDrone || !startTime || planMutation.isPending}
                    sx={{ py: 1.5 }}
                  >
                    {planMutation.isPending ? 'Планирование...' : 'Спланировать полёт'}
                  </Button>
                </Grid>
              </Grid>
              {planMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Ошибка при планировании полёта
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <MicroclimateMap
            lat={location.lat}
            lon={location.lon}
            onLocationSelect={(lat, lon) => setLocation({ lat, lon })}
          />
        </Grid>
        {plannedRoute && (
          <>
            <Grid item xs={12} md={6}>
              <RouteSummaryCard route={plannedRoute} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RouteMap route={plannedRoute} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
