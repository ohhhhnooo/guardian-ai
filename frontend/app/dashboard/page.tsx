'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, alpha } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Dashboard, FlightTakeoff, LocationOn } from '@mui/icons-material';
import { getCurrentWeather } from '@/lib/api/weatherApi';
import { getActiveFlights } from '@/lib/api/flightsApi';
import SafetyIndicator from '@/components/weather/SafetyIndicator';
import WeatherCard from '@/components/weather/WeatherCard';
import SafeWindowsList from '@/components/weather/SafeWindowsList';
import ActiveFlightsList from '@/components/monitoring/ActiveFlightsList';
import { colors } from '@/theme/theme';

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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
            <Dashboard sx={{ fontSize: 24, color: colors.background.primary }} />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: colors.accent.primary,
                fontSize: '0.65rem',
              }}
            >
              OPERATOR DASHBOARD
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              Дашборд оператора
            </Typography>
          </Box>
        </Box>

        {/* Location info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn sx={{ fontSize: 16, color: colors.text.muted }} />
          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Москва (55.75, 37.62)
          </Typography>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: colors.safety.green,
              boxShadow: `0 0 8px ${colors.safety.green}`,
              ml: 1,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: colors.safety.green,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.7rem',
            }}
          >
            LIVE
          </Typography>
        </Box>
      </Box>

      {weatherError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке данных о погоде
        </Alert>
      )}

      {weatherLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ color: colors.text.muted }}>
            Загрузка данных...
          </Typography>
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

          {/* Active Flights Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: colors.accent.primary,
                      boxShadow: `0 0 12px ${colors.accent.primary}`,
                      animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                  />
                  <Typography
                    variant="overline"
                    sx={{
                      color: colors.text.muted,
                      fontSize: '0.65rem',
                    }}
                  >
                    АКТИВНЫЕ ПОЛЁТЫ
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  {activeFlights && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(colors.accent.primary, 0.1),
                        border: `1px solid ${alpha(colors.accent.primary, 0.2)}`,
                      }}
                    >
                      <FlightTakeoff sx={{ fontSize: 14, color: colors.accent.primary }} />
                      <Typography
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: colors.accent.primary,
                        }}
                      >
                        {activeFlights.length}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {flightsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : activeFlights && activeFlights.length > 0 ? (
                  <ActiveFlightsList flights={activeFlights} />
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      px: 4,
                      borderRadius: 2,
                      border: `1px dashed ${colors.border.muted}`,
                      backgroundColor: alpha(colors.background.tertiary, 0.3),
                    }}
                  >
                    <FlightTakeoff
                      sx={{
                        fontSize: 40,
                        color: colors.text.muted,
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.secondary, mb: 1 }}
                    >
                      Нет активных полётов
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.muted }}
                    >
                      Запланируйте новый полёт в разделе &quot;Полёты&quot;
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
