'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getActiveFlights } from '@/lib/api/flightsApi';
import ActiveFlightsList from '@/components/monitoring/ActiveFlightsList';
import FlightCard from '@/components/monitoring/FlightCard';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function MonitoringPage() {
  const { showSnackbar } = useSnackbar();

  const { data: activeFlights, isLoading } = useQuery({
    queryKey: ['flights', 'active'],
    queryFn: getActiveFlights,
    refetchInterval: 10000, // Обновление каждые 10 секунд
  });

  // Мониторинг падения safety_index
  useEffect(() => {
    if (activeFlights) {
      activeFlights.forEach((flight) => {
        if (flight.current_safety_index && flight.current_safety_index < 60) {
          // Показываем уведомление только если индекс критически низкий
          showSnackbar(
            `⚠️ Внимание! Полёт ${flight.id}: индекс безопасности упал до ${flight.current_safety_index}. Рекомендуется экстренная посадка.`,
            'error'
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFlights]);

  const [selectedFlight, setSelectedFlight] = React.useState<string | null>(null);
  const selectedFlightData = activeFlights?.find((f) => f.id === selectedFlight);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Мониторинг полётов
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={selectedFlightData ? 6 : 12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Активные полёты
                </Typography>
                {activeFlights && activeFlights.length > 0 ? (
                  <ActiveFlightsList
                    flights={activeFlights}
                    onSelectFlight={setSelectedFlight}
                    selectedFlightId={selectedFlight}
                  />
                ) : (
                  <Alert severity="info">Нет активных полётов</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
          {selectedFlightData && (
            <Grid item xs={12} md={6}>
              <FlightCard flight={selectedFlightData} />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
