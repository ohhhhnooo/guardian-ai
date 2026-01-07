'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { CheckCircle, Warning, Cancel } from '@mui/icons-material';
import { SafetyClass } from '@/types/domain';

interface SafetyIndicatorProps {
  safetyIndex: number;
  safetyClass: SafetyClass;
}

export default function SafetyIndicator({ safetyIndex, safetyClass }: SafetyIndicatorProps) {
  const getColor = () => {
    switch (safetyClass) {
      case 'green':
        return { main: '#22c55e', light: '#dcfce7', text: '#166534' };
      case 'yellow':
        return { main: '#eab308', light: '#fef9c3', text: '#854d0e' };
      case 'red':
        return { main: '#ef4444', light: '#fee2e2', text: '#991b1b' };
      default:
        return { main: '#6b7280', light: '#f3f4f6', text: '#374151' };
    }
  };

  const getLabel = () => {
    switch (safetyClass) {
      case 'green':
        return 'Безопасно';
      case 'yellow':
        return 'Умеренный риск';
      case 'red':
        return 'Опасно';
      default:
        return 'Неизвестно';
    }
  };

  const getIcon = () => {
    switch (safetyClass) {
      case 'green':
        return <CheckCircle sx={{ fontSize: 64, color: getColor().main }} />;
      case 'yellow':
        return <Warning sx={{ fontSize: 64, color: getColor().main }} />;
      case 'red':
        return <Cancel sx={{ fontSize: 64, color: getColor().main }} />;
      default:
        return null;
    }
  };

  const colors = getColor();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ mb: 2 }}>{getIcon()}</Box>
          <Typography
            variant="h2"
            component="div"
            sx={{
              fontWeight: 700,
              color: colors.main,
              mb: 1,
            }}
          >
            {safetyIndex}
          </Typography>
          <Chip
            label={getLabel()}
            sx={{
              bgcolor: colors.light,
              color: colors.text,
              fontWeight: 600,
              fontSize: '0.875rem',
              px: 2,
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Индекс безопасности полёта
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

