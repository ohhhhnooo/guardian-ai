'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  alpha,
} from '@mui/material';
import { Radar, Warning, FlightTakeoff } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getActiveFlights } from '@/lib/api/flightsApi';
import { getDrones } from '@/lib/api/dronesApi';
import { getOperators } from '@/lib/api/operatorsApi';
import FlightMapWrapper from '@/components/map/FlightMapWrapper';
import ActiveFlightsList from '@/components/monitoring/ActiveFlightsList';
import FlightCard from '@/components/monitoring/FlightCard';
import { useSnackbar } from '@/hooks/useSnackbar';
import { colors } from '@/theme/theme';

export default function MonitoringPage() {
  const { showSnackbar } = useSnackbar();
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

  const { data: activeFlights, isLoading } = useQuery({
    queryKey: ['flights', 'active'],
    queryFn: getActiveFlights,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  const { data: drones } = useQuery({
    queryKey: ['drones'],
    queryFn: getDrones,
  });

  const { data: operators } = useQuery({
    queryKey: ['operators'],
    queryFn: getOperators,
  });

  // Monitor safety index drops
  useEffect(() => {
    if (activeFlights) {
      activeFlights.forEach((flight) => {
        if (flight.current_safety_index && flight.current_safety_index < 60) {
          showSnackbar(
            `КРИТИЧНО: Полёт ${flight.id} - индекс безопасности ${Math.round(flight.current_safety_index)}. Рекомендуется экстренная посадка.`,
            'error'
          );
        }
      });
    }
  }, [activeFlights, showSnackbar]);

  const selectedFlightData = activeFlights?.find((f) => f.id === selectedFlight);

  // Get drone and operator info for selected flight
  const selectedDrone = drones?.find((d) => d.id === selectedFlightData?.drone_id);
  const selectedOperator = operators?.find((o) => o.id === selectedFlightData?.operator_id);

  // Stats
  const greenFlights = activeFlights?.filter((f) => f.current_safety_class === 'green').length || 0;
  const yellowFlights = activeFlights?.filter((f) => f.current_safety_class === 'yellow').length || 0;
  const redFlights = activeFlights?.filter((f) => f.current_safety_class === 'red').length || 0;

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
              REAL-TIME MONITORING
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.2,
              }}
            >
              Мониторинг полётов
            </Typography>
          </Box>
        </Box>

        {/* Stats bar */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {[
            { label: 'Всего в воздухе', value: activeFlights?.length || 0, color: colors.accent.primary },
            { label: 'Безопасно', value: greenFlights, color: colors.safety.green },
            { label: 'Внимание', value: yellowFlights, color: colors.safety.yellow },
            { label: 'Критично', value: redFlights, color: colors.safety.red },
          ].map((stat, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: stat.color,
                  boxShadow: `0 0 8px ${stat.color}`,
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: stat.color,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.text.muted, fontSize: '0.7rem' }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {isLoading ? (
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
            Загрузка данных мониторинга...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Map */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border.default}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: colors.safety.green,
                        boxShadow: `0 0 12px ${colors.safety.green}`,
                        animation: 'pulse-glow 2s ease-in-out infinite',
                      }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: colors.text.muted, fontSize: '0.65rem' }}
                    >
                      КАРТА ПОЛЁТОВ В РЕАЛЬНОМ ВРЕМЕНИ
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.muted,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      Обновление: 5 сек
                    </Typography>
                  </Box>
                </Box>
                {activeFlights && activeFlights.length > 0 ? (
                  <FlightMapWrapper
                    flights={activeFlights}
                    selectedFlightId={selectedFlight}
                    onSelectFlight={setSelectedFlight}
                    showRoutes={true}
                    height={450}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <FlightTakeoff sx={{ fontSize: 48, color: colors.text.muted, opacity: 0.5 }} />
                    <Typography sx={{ color: colors.text.secondary }}>
                      Нет активных полётов
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Active Flights List */}
          <Grid item xs={12} md={selectedFlightData ? 5 : 12}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: colors.accent.primary,
                      boxShadow: `0 0 12px ${colors.accent.primary}`,
                    }}
                  />
                  <Typography
                    variant="overline"
                    sx={{ color: colors.text.muted, fontSize: '0.65rem' }}
                  >
                    АКТИВНЫЕ ПОЛЁТЫ
                  </Typography>
                </Box>

                {activeFlights && activeFlights.length > 0 ? (
                  <ActiveFlightsList
                    flights={activeFlights}
                    drones={drones || []}
                    operators={operators || []}
                    onSelectFlight={setSelectedFlight}
                    selectedFlightId={selectedFlight}
                  />
                ) : (
                  <Alert severity="info">Нет активных полётов в данный момент</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Selected Flight Details */}
          {selectedFlightData && (
            <Grid item xs={12} md={7}>
              <FlightCard
                flight={selectedFlightData}
                drone={selectedDrone}
                operator={selectedOperator}
              />
            </Grid>
          )}

          {/* Warnings section */}
          {activeFlights && activeFlights.some((f) => f.last_warning) && (
            <Grid item xs={12}>
              <Card
                sx={{
                  borderColor: alpha(colors.safety.yellow, 0.3),
                  '&::before': {
                    background: `linear-gradient(90deg, transparent, ${colors.safety.yellow}, transparent)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Warning sx={{ color: colors.safety.yellow, fontSize: 20 }} />
                    <Typography
                      variant="overline"
                      sx={{ color: colors.safety.yellow, fontSize: '0.65rem' }}
                    >
                      АКТИВНЫЕ ПРЕДУПРЕЖДЕНИЯ
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {activeFlights
                      .filter((f) => f.last_warning)
                      .map((flight) => (
                        <Box
                          key={flight.id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor:
                              flight.current_safety_class === 'red'
                                ? alpha(colors.safety.red, 0.1)
                                : alpha(colors.safety.yellow, 0.1),
                            border: `1px solid ${
                              flight.current_safety_class === 'red'
                                ? alpha(colors.safety.red, 0.3)
                                : alpha(colors.safety.yellow, 0.3)
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor:
                                flight.current_safety_class === 'red'
                                  ? colors.safety.red
                                  : colors.safety.yellow,
                              boxShadow: `0 0 10px ${
                                flight.current_safety_class === 'red'
                                  ? colors.safety.red
                                  : colors.safety.yellow
                              }`,
                              animation: 'pulse-glow 1s ease-in-out infinite',
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: colors.text.primary,
                                mb: 0.5,
                              }}
                            >
                              {flight.id}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.85rem',
                                color:
                                  flight.current_safety_class === 'red'
                                    ? colors.safety.red
                                    : colors.safety.yellow,
                              }}
                            >
                              {flight.last_warning?.message}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text.muted,
                              fontFamily: '"JetBrains Mono", monospace',
                            }}
                          >
                            {new Date(flight.last_warning!.time).toLocaleTimeString('ru-RU')}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
