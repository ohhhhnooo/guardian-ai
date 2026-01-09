'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { Air, Thermostat, WaterDrop, Visibility, Cloud } from '@mui/icons-material';
import { ForecastPoint } from '@/types/domain';
import { colors } from '@/theme/theme';

interface SafetyDetailsProps {
  weather: ForecastPoint;
}

export default function SafetyDetails({ weather }: SafetyDetailsProps) {
  const calculateFactorImpact = () => {
    const factors: Array<{
      name: string;
      icon: React.ElementType;
      impact: number;
      reason: string;
      color: string;
    }> = [];

    // Wind
    let windImpact = 0;
    if (weather.wind_speed_mps > 15) {
      windImpact = -30;
    } else if (weather.wind_speed_mps > 10) {
      windImpact = -15;
    } else if (weather.wind_speed_mps > 7) {
      windImpact = -5;
    }
    if (weather.wind_gust_mps > weather.wind_speed_mps * 1.5) {
      windImpact -= 10;
    }
    factors.push({
      name: 'Ветер',
      icon: Air,
      impact: windImpact,
      reason: `${weather.wind_speed_mps.toFixed(1)} м/с`,
      color: colors.accent.primary,
    });

    // Temperature
    let tempImpact = 0;
    if (weather.temp_c < -10 || weather.temp_c > 35) {
      tempImpact = -20;
    } else if (weather.temp_c < 0 || weather.temp_c > 30) {
      tempImpact = -10;
    } else if (weather.temp_c < 5 || weather.temp_c > 25) {
      tempImpact = -5;
    }
    factors.push({
      name: 'Температура',
      icon: Thermostat,
      impact: tempImpact,
      reason: `${weather.temp_c.toFixed(1)}°C`,
      color: '#ff6b6b',
    });

    // Precipitation
    let precipImpact = 0;
    if (weather.precip_mmph > 2) {
      precipImpact = -25;
    } else if (weather.precip_mmph > 1) {
      precipImpact = -15;
    } else if (weather.precip_mmph > 0.5) {
      precipImpact = -5;
    }
    factors.push({
      name: 'Осадки',
      icon: WaterDrop,
      impact: precipImpact,
      reason: `${weather.precip_mmph.toFixed(1)} мм/ч`,
      color: '#4facfe',
    });

    // Visibility
    let visibilityImpact = 0;
    if (weather.visibility_km < 1) {
      visibilityImpact = -30;
    } else if (weather.visibility_km < 3) {
      visibilityImpact = -15;
    } else if (weather.visibility_km < 5) {
      visibilityImpact = -5;
    }
    factors.push({
      name: 'Видимость',
      icon: Visibility,
      impact: visibilityImpact,
      reason: `${weather.visibility_km.toFixed(1)} км`,
      color: '#a78bfa',
    });

    // Cloud cover
    let cloudImpact = 0;
    if (weather.cloud_cover_pct > 90) {
      cloudImpact = -5;
    }
    factors.push({
      name: 'Облачность',
      icon: Cloud,
      impact: cloudImpact,
      reason: `${weather.cloud_cover_pct.toFixed(0)}%`,
      color: '#94a3b8',
    });

    return factors;
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 0) return colors.safety.green;
    if (impact > -10) return colors.safety.yellow;
    return colors.safety.red;
  };

  const factors = calculateFactorImpact();

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
            }}
          />
          <Typography
            variant="overline"
            sx={{
              color: colors.text.muted,
              fontSize: '0.65rem',
            }}
          >
            АНАЛИЗ ФАКТОРОВ
          </Typography>
        </Box>

        {/* Factors list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {factors.map((factor, index) => {
            const Icon = factor.icon;
            const impactColor = getImpactColor(factor.impact);

            return (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: colors.background.tertiary,
                  border: `1px solid ${colors.border.default}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: alpha(factor.color, 0.3),
                  },
                }}
              >
                <Box
                  sx={{
                    p: 0.75,
                    borderRadius: 1.5,
                    backgroundColor: alpha(factor.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 16, color: factor.color }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: colors.text.primary,
                      fontSize: '0.8rem',
                    }}
                  >
                    {factor.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem',
                    }}
                  >
                    {factor.reason}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: alpha(impactColor, 0.1),
                    border: `1px solid ${alpha(impactColor, 0.3)}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: impactColor,
                    }}
                  >
                    {factor.impact >= 0 ? `+${factor.impact}` : factor.impact}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${colors.border.default}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: colors.text.muted, fontSize: '0.7rem' }}
          >
            Вклад каждого фактора в итоговый индекс безопасности
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
