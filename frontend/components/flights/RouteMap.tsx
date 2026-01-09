'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import { Map as MapIcon, LocationOn } from '@mui/icons-material';
import { FlightPlan } from '@/types/domain';

interface RouteMapProps {
  route: FlightPlan;
}

export default function RouteMap({ route }: RouteMapProps) {
  const getSafetyColor = (safetyClass: string) => {
    switch (safetyClass) {
      case 'green':
        return '#22c55e';
      case 'yellow':
        return '#eab308';
      case 'red':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MapIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Визуализация маршрута
          </Typography>
        </Box>
        <Paper
          sx={{
            position: 'relative',
            width: '100%',
            height: 400,
            bgcolor: 'grey.100',
            backgroundImage: 'url("/assets/map_mock.png")',
            borderRadius: 2,
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'grey.300',
          }}
        >
          {/* Упрощённая визуализация маршрута */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '60%',
            }}
          >
            {/* Линия маршрута */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '80%',
                height: '2px',
                bgcolor: getSafetyColor(route.route.avg_safety_class),
                transform: 'rotate(15deg)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-4px',
                  left: 0,
                  width: '100%',
                  height: '10px',
                  bgcolor: `${getSafetyColor(route.route.avg_safety_class)}40`,
                },
              }}
            />
            {/* Точки маршрута */}
            {route.route.waypoints.map((point, index) => {
              const x = route.route.waypoints.length > 1
                ? 10 + (index / (route.route.waypoints.length - 1)) * 80
                : 50;
              const y = 20 + Math.sin(index * 0.5) * 30;
              return (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <LocationOn
                    sx={{
                      fontSize: 24,
                      color: getSafetyColor(point.safety_class),
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {index + 1}
                  </Box>
                </Box>
              );
            })}
            {/* Стартовая точка */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <LocationOn sx={{ fontSize: 32, color: 'success.main' }} />
            </Box>
            {/* Конечная точка */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '90%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <LocationOn sx={{ fontSize: 32, color: 'error.main' }} />
            </Box>
          </Box>
        </Paper>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Маршрут включает {route.route.waypoints.length} точек
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Цвет линии соответствует уровню безопасности
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
