'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AccessTime, CheckCircle } from '@mui/icons-material';
import { SafeWindow } from '@/types/domain';

interface SafeWindowsListProps {
  windows: SafeWindow[];
}

export default function SafeWindowsList({ windows }: SafeWindowsListProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)} ч`;
  };

  // Сортируем окна по индексу безопасности (лучшие первыми)
  const sortedWindows = [...windows].sort((a, b) => b.max_safety_index - a.max_safety_index);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Безопасные окна для полёта
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sortedWindows.map((window, index) => (
            <Box
              key={index}
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: index === 0 ? 'success.light' : 'grey.50',
                border: index === 0 ? 2 : 1,
                borderColor: index === 0 ? 'success.main' : 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: index === 0 ? 'success.main' : 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTime />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatTime(window.start)} — {formatTime(window.end)}
                    </Typography>
                    {index === 0 && (
                      <Chip
                        label="Лучшее окно"
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Длительность: {getDuration(window.start, window.end)} • Индекс: {window.max_safety_index}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ml: 2 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 32 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

