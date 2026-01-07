'use client';

import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Chip, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { Flight } from '@/types/domain';

interface ActiveFlightsListProps {
  flights: Flight[];
  onSelectFlight?: (flightId: string) => void;
  selectedFlightId?: string | null;
}

export default function ActiveFlightsList({
  flights,
  onSelectFlight,
  selectedFlightId,
}: ActiveFlightsListProps) {
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

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <Remove sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  return (
    <List>
      {flights.map((flight) => (
        <ListItem
          key={flight.id}
          disablePadding
          sx={{ mb: 1 }}
        >
          <ListItemButton
            selected={selectedFlightId === flight.id}
            onClick={() => onSelectFlight?.(flight.id)}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: selectedFlightId === flight.id ? 'primary.main' : 'grey.200',
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Полёт #{flight.id.slice(-6)}
                  </Typography>
                  {flight.current_safety_index && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getTrendIcon('stable')}
                      <Chip
                        label={flight.current_safety_index}
                        size="small"
                        color={getSafetyColor(flight.current_safety_class) as any}
                      />
                    </Box>
                  )}
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Дрон: {flight.drone_id} • Статус: {flight.status}
                  </Typography>
                  {flight.last_warning && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                      ⚠️ {flight.last_warning.message}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

