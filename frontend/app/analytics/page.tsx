'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/lib/api/analyticsApi';
import AnalyticsCards from '@/components/analytics/AnalyticsCards';
import FlightsSuccessChart from '@/components/analytics/FlightsSuccessChart';
import DowntimeChart from '@/components/analytics/DowntimeChart';
import EconomyChart from '@/components/analytics/EconomyChart';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Аналитика и отчёты
      </Typography>

      <AnalyticsCards analytics={analytics} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <FlightsSuccessChart data={analytics.flights_success_by_weather} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DowntimeChart data={analytics.downtime_stats} />
        </Grid>
        <Grid item xs={12} md={6}>
          <EconomyChart data={analytics.economy_metrics} />
        </Grid>
      </Grid>
    </Box>
  );
}
