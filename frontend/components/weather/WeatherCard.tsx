'use client';

import React from 'react';
import { Card, CardContent, Typography, Grid, Box, alpha } from '@mui/material';
import {
  Thermostat,
  Air,
  WaterDrop,
  Visibility,
  Compress,
  Cloud,
} from '@mui/icons-material';
import { ForecastPoint } from '@/types/domain';
import { colors } from '@/theme/theme';

interface WeatherCardProps {
  weather: ForecastPoint;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const metrics = [
    {
      icon: Thermostat,
      label: 'ТЕМПЕРАТУРА',
      value: weather.temp_c.toFixed(1),
      unit: '°C',
      color: '#ff6b6b',
    },
    {
      icon: Air,
      label: 'ВЕТЕР',
      value: weather.wind_speed_mps.toFixed(1),
      unit: 'м/с',
      color: colors.accent.primary,
    },
    {
      icon: Air,
      label: 'ПОРЫВЫ',
      value: weather.wind_gust_mps.toFixed(1),
      unit: 'м/с',
      color: colors.accent.primary,
      warning: weather.wind_gust_mps > 10,
    },
    {
      icon: WaterDrop,
      label: 'ОСАДКИ',
      value: weather.precip_mmph.toFixed(1),
      unit: 'мм/ч',
      color: '#4facfe',
    },
    {
      icon: Visibility,
      label: 'ВИДИМОСТЬ',
      value: weather.visibility_km.toFixed(1),
      unit: 'км',
      color: '#a78bfa',
    },
    {
      icon: Compress,
      label: 'ДАВЛЕНИЕ',
      value: weather.pressure_hpa.toFixed(0),
      unit: 'гПа',
      color: '#f59e0b',
    },
    {
      icon: Cloud,
      label: 'ОБЛАЧНОСТЬ',
      value: weather.cloud_cover_pct.toFixed(0),
      unit: '%',
      color: '#94a3b8',
    },
  ];

  return (
    <Card sx={{ height: '100%' }}>
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
            ТЕКУЩИЕ УСЛОВИЯ
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            sx={{
              color: colors.text.muted,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
            }}
          >
            {new Date(weather.time).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={1.5}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Grid item xs={6} sm={4} key={index}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: colors.background.tertiary,
                    border: `1px solid ${metric.warning ? alpha(colors.safety.yellow, 0.3) : colors.border.default}`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: alpha(metric.color, 0.4),
                      backgroundColor: alpha(metric.color, 0.05),
                    },
                    '&::before': metric.warning ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: colors.safety.yellow,
                    } : {},
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box
                      sx={{
                        p: 0.75,
                        borderRadius: 1.5,
                        backgroundColor: alpha(metric.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 16,
                          color: metric.color,
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.muted,
                          fontSize: '0.6rem',
                          letterSpacing: '0.05em',
                          display: 'block',
                          mb: 0.25,
                        }}
                      >
                        {metric.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: metric.warning ? colors.safety.yellow : colors.text.primary,
                            lineHeight: 1,
                          }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.muted,
                            fontSize: '0.65rem',
                          }}
                        >
                          {metric.unit}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Footer status */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: colors.text.muted, fontSize: '0.7rem' }}
          >
            Данные обновлены
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: colors.safety.green,
                boxShadow: `0 0 6px ${colors.safety.green}`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: colors.safety.green,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
              }}
            >
              LIVE
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
