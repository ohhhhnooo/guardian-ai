'use client';

import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import {
  Thermostat,
  Air,
  WaterDrop,
  Visibility,
  Compress,
  Cloud,
} from '@mui/icons-material';
import { ForecastPoint } from '@/types/domain';

interface WeatherCardProps {
  weather: ForecastPoint;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const metrics = [
    {
      icon: Thermostat,
      label: 'Температура',
      value: `${weather.temp_c.toFixed(1)}°C`,
      color: '#f97316',
    },
    {
      icon: Air,
      label: 'Ветер',
      value: `${weather.wind_speed_mps.toFixed(1)} м/с`,
      color: '#3b82f6',
    },
    {
      icon: Air,
      label: 'Порывы',
      value: `${weather.wind_gust_mps.toFixed(1)} м/с`,
      color: '#3b82f6',
    },
    {
      icon: WaterDrop,
      label: 'Осадки',
      value: `${weather.precip_mmph.toFixed(1)} мм/ч`,
      color: '#0ea5e9',
    },
    {
      icon: Visibility,
      label: 'Видимость',
      value: `${weather.visibility_km.toFixed(1)} км`,
      color: '#8b5cf6',
    },
    {
      icon: Compress,
      label: 'Давление',
      value: `${weather.pressure_hpa} гПа`,
      color: '#6366f1',
    },
    {
      icon: Cloud,
      label: 'Облачность',
      value: `${weather.cloud_cover_pct}%`,
      color: '#64748b',
    },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Текущие условия
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Grid item xs={6} sm={4} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: `${metric.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color: metric.color }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {metric.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {metric.value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
