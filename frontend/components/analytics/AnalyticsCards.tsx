'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, Schedule, Warning, AttachMoney } from '@mui/icons-material';
import { AnalyticsData } from '@/types/domain';

interface AnalyticsCardsProps {
  analytics: AnalyticsData;
}

export default function AnalyticsCards({ analytics }: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Успешных полётов',
      value: `${analytics.summary.success_rate.toFixed(1)}%`,
      icon: TrendingUp,
      color: '#22c55e',
      subtitle: `${analytics.summary.total_flights} всего`,
    },
    {
      title: 'Часов налёта',
      value: analytics.summary.total_flight_hours.toFixed(0),
      icon: Schedule,
      color: '#3b82f6',
      subtitle: 'За весь период',
    },
    {
      title: 'Предупреждений',
      value: analytics.summary.total_warnings.toString(),
      icon: Warning,
      color: '#eab308',
      subtitle: 'Всего выдано',
    },
    {
      title: 'Экономия',
      value: `${analytics.economy_metrics.savings_rub.toFixed(0)} ₽`,
      icon: AttachMoney,
      color: '#10b981',
      subtitle: 'Благодаря планированию',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${card.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 28, color: card.color }} />
                  </Box>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

