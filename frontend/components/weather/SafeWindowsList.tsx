'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { Schedule, Star } from '@mui/icons-material';
import { SafeWindow } from '@/types/domain';
import { colors } from '@/theme/theme';

interface SafeWindowsListProps {
  windows: SafeWindow[];
}

export default function SafeWindowsList({ windows }: SafeWindowsListProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}ч`;
  };

  const sortedWindows = [...windows].sort((a, b) => b.max_safety_index - a.max_safety_index);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: colors.safety.green,
              boxShadow: `0 0 12px ${colors.safety.green}`,
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
          <Typography
            variant="overline"
            sx={{
              color: colors.text.muted,
              fontSize: '0.65rem',
            }}
          >
            БЕЗОПАСНЫЕ ОКНА ДЛЯ ПОЛЁТА
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            sx={{
              color: colors.text.muted,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {sortedWindows.length} найдено
          </Typography>
        </Box>

        {/* Windows list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sortedWindows.map((window, index) => {
            const isBest = index === 0;

            return (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: isBest
                    ? alpha(colors.safety.green, 0.05)
                    : colors.background.tertiary,
                  border: `1px solid ${isBest ? alpha(colors.safety.green, 0.3) : colors.border.default}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: isBest
                      ? alpha(colors.safety.green, 0.5)
                      : colors.border.muted,
                  },
                  '&::before': isBest ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: colors.safety.green,
                  } : {},
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: isBest
                      ? alpha(colors.safety.green, 0.15)
                      : alpha(colors.accent.primary, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Schedule
                    sx={{
                      fontSize: 22,
                      color: isBest ? colors.safety.green : colors.accent.primary,
                    }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}
                    >
                      {formatTime(window.start)} — {formatTime(window.end)}
                    </Typography>
                    {isBest && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          backgroundColor: alpha(colors.safety.green, 0.15),
                          border: `1px solid ${alpha(colors.safety.green, 0.3)}`,
                        }}
                      >
                        <Star sx={{ fontSize: 12, color: colors.safety.green }} />
                        <Typography
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            color: colors.safety.green,
                            letterSpacing: '0.05em',
                          }}
                        >
                          ЛУЧШЕЕ
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.muted,
                      fontSize: '0.75rem',
                    }}
                  >
                    Длительность: {getDuration(window.start, window.end)}
                  </Typography>
                </Box>

                {/* Safety index */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: colors.safety.green,
                      lineHeight: 1,
                      textShadow: isBest ? `0 0 20px ${alpha(colors.safety.green, 0.5)}` : 'none',
                    }}
                  >
                    {window.max_safety_index}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.muted,
                      fontSize: '0.6rem',
                    }}
                  >
                    ИНДЕКС
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
