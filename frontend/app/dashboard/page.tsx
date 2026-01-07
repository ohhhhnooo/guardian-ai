'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather } from '@/lib/api/weatherApi';
import { getActiveFlights } from '@/lib/api/flightsApi';
import SafetyIndicator from '@/components/weather/SafetyIndicator';
import WeatherCard from '@/components/weather/WeatherCard';
import SafeWindowsList from '@/components/weather/SafeWindowsList';
import ActiveFlightsList from '@/components/monitoring/ActiveFlightsList';

export default function DashboardPage() {
  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useQuery({
    queryKey: ['weather', 'current', 55.75, 37.62],
    queryFn: () => getCurrentWeather(55.75, 37.62),
  });

  const { data: activeFlights, isLoading: flightsLoading } = useQuery({
    queryKey: ['flights', 'active'],
    queryFn: getActiveFlights,
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Дашборд оператора
      </Typography>

      {weatherError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке данных о погоде
        </Alert>
      )}

      {weatherLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {weatherData && (
            <>
              <Grid item xs={12} md={4}>
                <SafetyIndicator
                  safetyIndex={weatherData.current.safety_index}
                  safetyClass={weatherData.current.safety_class}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <WeatherCard weather={weatherData.current} />
              </Grid>
              {weatherData.safe_windows && weatherData.safe_windows.length > 0 && (
                <Grid item xs={12}>
                  <SafeWindowsList windows={weatherData.safe_windows} />
                </Grid>
              )}
            </>
          )}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Активные полёты
                </Typography>
                {flightsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <ActiveFlightsList flights={activeFlights || []} />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

