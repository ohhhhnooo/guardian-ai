'use client';

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import { ForecastPoint } from '@/types/domain';

interface SafetyDetailsProps {
  weather: ForecastPoint;
}

export default function SafetyDetails({ weather }: SafetyDetailsProps) {
  // Простая логика оценки вклада факторов (можно улучшить)
  const calculateFactorImpact = () => {
    const factors: Array<{ name: string; impact: number; reason: string }> = [];

    // Ветер
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
      impact: windImpact,
      reason: `${weather.wind_speed_mps.toFixed(1)} м/с (порывы до ${weather.wind_gust_mps.toFixed(1)} м/с)`,
    });

    // Температура
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
      impact: tempImpact,
      reason: `${weather.temp_c.toFixed(1)}°C`,
    });

    // Осадки
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
      impact: precipImpact,
      reason: `${weather.precip_mmph.toFixed(1)} мм/ч`,
    });

    // Видимость
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
      impact: visibilityImpact,
      reason: `${weather.visibility_km.toFixed(1)} км`,
    });

    // Облачность (меньший вклад)
    let cloudImpact = 0;
    if (weather.cloud_cover_pct > 90) {
      cloudImpact = -5;
    }
    factors.push({
      name: 'Облачность',
      impact: cloudImpact,
      reason: `${weather.cloud_cover_pct}%`,
    });

    return factors;
  };

  const factors = calculateFactorImpact();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Детали безопасности
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Вклад факторов в оценку безопасности
        </Typography>
        <List>
          {factors.map((factor, index) => (
            <ListItem
              key={index}
              sx={{
                bgcolor: 'grey.50',
                borderRadius: 1,
                mb: 1,
                py: 1.5,
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {factor.name}
                    </Typography>
                    <Chip
                      label={factor.impact >= 0 ? `+${factor.impact}` : factor.impact}
                      size="small"
                      color={factor.impact >= 0 ? 'success' : factor.impact > -10 ? 'warning' : 'error'}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={factor.reason}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
