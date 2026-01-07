'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Flight, Warning, Schedule } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Flight as FlightType } from '@/types/domain';

interface FlightCardProps {
  flight: FlightType;
}

export default function FlightCard({ flight }: FlightCardProps) {
  // Моковые данные для таймлайна (в реальности должны приходить с бэкенда)
  const timelineData = Array.from({ length: 10 }, (_, i) => ({
    time: new Date(Date.now() - (10 - i) * 60000).toLocaleTimeString('ru', { minute: '2-digit', second: '2-digit' }),
    safety: 70 + Math.random() * 20,
  }));

  const getSafetyColor = (safetyClass?: string) => {
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
          <Flight color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Детали полёта
          </Typography>
        </Box>

        <List>
          <ListItem>
            <Schedule sx={{ mr: 2, color: 'text.secondary' }} />
            <ListItemText
              primary="Время старта"
              secondary={new Date(flight.planned_start).toLocaleString('ru')}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Текущий индекс безопасности"
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="h6" component="span">
                    {flight.current_safety_index || 'N/A'}
                  </Typography>
                  {flight.current_safety_class && (
                    <Chip
                      label={flight.current_safety_class.toUpperCase()}
                      size="small"
                      color={getSafetyColor(flight.current_safety_class) as any}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
          {flight.last_warning && (
            <>
              <Divider />
              <ListItem>
                <Warning sx={{ mr: 2, color: 'error.main' }} />
                <ListItemText
                  primary="Последнее предупреждение"
                  secondary={
                    <Box>
                      <Typography variant="body2" color="error">
                        {flight.last_warning.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(flight.last_warning.time).toLocaleString('ru')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </>
          )}
        </List>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Динамика индекса безопасности
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="safety"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

