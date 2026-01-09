'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Route, Schedule, TrendingUp, Warning } from '@mui/icons-material';
import { FlightPlan } from '@/types/domain';

interface RouteSummaryCardProps {
  route: FlightPlan;
}

export default function RouteSummaryCard({ route }: RouteSummaryCardProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSafetyColor = (safetyClass: string) => {
    switch (safetyClass) {
      case 'green':
        return 'success';
      case 'yellow':
        return 'warning';
      case 'red':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Route color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Сводка маршрута
          </Typography>
        </Box>

        <List>
          <ListItem>
            <Schedule sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary="Рекомендованное время старта"
              secondary={formatTime(route.recommended_start)}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <Route sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary="Расстояние"
              secondary={`${route.route.distance_km.toFixed(2)} км`}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <TrendingUp sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary="Максимальная высота"
              secondary={`${route.route.max_altitude_m} м`}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Warning sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary="Индекс безопасности"
                secondary={`Средний: ${route.route.avg_safety_index.toFixed(0)}`}
              />
              <Chip
                label={route.route.avg_safety_class.toUpperCase()}
                color={getSafetyColor(route.route.avg_safety_class) as any}
                size="small"
              />
            </Box>
          </ListItem>
        </List>

        {route.alternative_routes && route.alternative_routes.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#12181F', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Резервные маршруты: {route.alternative_routes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              В случае ухудшения погоды доступны альтернативные варианты
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
