'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Paper } from '@mui/material';
import { Map as MapIcon, LocationOn } from '@mui/icons-material';

interface MicroclimateMapProps {
  lat: number;
  lon: number;
  onLocationSelect?: (lat: number, lon: number) => void;
}

export default function MicroclimateMap({ lat, lon, onLocationSelect }: MicroclimateMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lon: number } | null>(null);

  // Упрощённая карта (можно заменить на Leaflet/Mapbox)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Простая трансформация координат (для демо)
    const newLat = lat + (y - rect.height / 2) * 0.01;
    const newLon = lon + (x - rect.width / 2) * 0.01;
    
    setSelectedPoint({ lat: newLat, lon: newLon });
    if (onLocationSelect) {
      onLocationSelect(newLat, newLon);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MapIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Карта локации
          </Typography>
        </Box>
        <Paper
          onClick={handleMapClick}
          sx={{
            position: 'relative',
            width: '100%',
            height: 400,
            bgcolor: 'grey.100',
            backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            cursor: 'crosshair',
            borderRadius: 2,
            overflow: 'hidden',
            border: '2px dashed',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <LocationOn sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          {selectedPoint && (
            <Box
              sx={{
                position: 'absolute',
                top: `${50 + (selectedPoint.lat - lat) * 100}%`,
                left: `${50 + (selectedPoint.lon - lon) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <LocationOn sx={{ fontSize: 32, color: 'success.main' }} />
            </Box>
          )}
        </Paper>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Текущая позиция: {lat.toFixed(4)}, {lon.toFixed(4)}
          </Typography>
          {selectedPoint && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Выбрано: {selectedPoint.lat.toFixed(4)}, {selectedPoint.lon.toFixed(4)}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Кликните на карте для выбора новой локации
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

