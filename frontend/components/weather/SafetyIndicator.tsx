'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, alpha } from '@mui/material';
import { SafetyClass } from '@/types/domain';
import { colors } from '@/theme/theme';

interface SafetyIndicatorProps {
  safetyIndex: number;
  safetyClass: SafetyClass;
}

export default function SafetyIndicator({ safetyIndex, safetyClass }: SafetyIndicatorProps) {
  const getColor = () => {
    switch (safetyClass) {
      case 'green':
        return colors.safety.green;
      case 'yellow':
        return colors.safety.yellow;
      case 'red':
        return colors.safety.red;
      default:
        return colors.text.muted;
    }
  };

  const getLabel = () => {
    switch (safetyClass) {
      case 'green':
        return 'БЕЗОПАСНО';
      case 'yellow':
        return 'ВНИМАНИЕ';
      case 'red':
        return 'ОПАСНО';
      default:
        return 'НЕТ ДАННЫХ';
    }
  };

  const getDescription = () => {
    switch (safetyClass) {
      case 'green':
        return 'Условия оптимальны для полёта';
      case 'yellow':
        return 'Полёт возможен с ограничениями';
      case 'red':
        return 'Полёт не рекомендуется';
      default:
        return 'Данные недоступны';
    }
  };

  const statusColor = getColor();
  const circumference = 2 * Math.PI * 54; // radius = 54
  const progress = (safetyIndex / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: statusColor,
              boxShadow: `0 0 12px ${statusColor}`,
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
            ИНДЕКС БЕЗОПАСНОСТИ
          </Typography>
        </Box>

        {/* Circular Gauge */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            my: 2,
          }}
        >
          {/* Background glow */}
          <Box
            sx={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(statusColor, 0.15)} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />

          {/* SVG Gauge */}
          <svg width="140" height="140" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={colors.border.default}
              strokeWidth="6"
              opacity="0.5"
            />

            {/* Progress arc */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={statusColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
              style={{
                filter: `drop-shadow(0 0 8px ${statusColor})`,
                transition: 'stroke-dashoffset 0.8s ease-out',
              }}
            />

            {/* Inner circle decoration */}
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke={alpha(statusColor, 0.2)}
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Tick marks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="60"
                y1="10"
                x2="60"
                y2="14"
                stroke={colors.text.muted}
                strokeWidth="1"
                transform={`rotate(${angle} 60 60)`}
                opacity="0.5"
              />
            ))}
          </svg>

          {/* Center content */}
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: statusColor,
                textShadow: `0 0 30px ${alpha(statusColor, 0.5)}`,
                lineHeight: 1,
                animation: 'data-flicker 4s ease-in-out infinite',
              }}
            >
              {safetyIndex}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.text.muted,
                fontSize: '0.6rem',
                mt: 0.5,
              }}
            >
              / 100
            </Typography>
          </Box>
        </Box>

        {/* Status Badge */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: '20px',
              backgroundColor: alpha(statusColor, 0.1),
              border: `1px solid ${alpha(statusColor, 0.3)}`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: statusColor,
                boxShadow: `0 0 6px ${statusColor}`,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: statusColor,
                letterSpacing: '0.1em',
              }}
            >
              {getLabel()}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: colors.text.secondary,
            textAlign: 'center',
            fontSize: '0.8rem',
          }}
        >
          {getDescription()}
        </Typography>

        {/* Bottom metrics */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${colors.border.default}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}
            >
              МИНИМУМ
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: safetyIndex >= 60 ? colors.safety.green : colors.safety.red,
              }}
            >
              60
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: colors.text.muted, display: 'block', mb: 0.5 }}
            >
              ОПТИМУМ
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: safetyIndex >= 80 ? colors.safety.green : colors.text.secondary,
              }}
            >
              80+
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
