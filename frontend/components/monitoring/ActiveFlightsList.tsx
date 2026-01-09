'use client';

import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { Flight, Drone, Operator } from '@/types/domain';
import { colors } from '@/theme/theme';

interface ActiveFlightsListProps {
  flights: Flight[];
  drones?: Drone[];
  operators?: Operator[];
  onSelectFlight?: (flightId: string) => void;
  selectedFlightId?: string | null;
}

export default function ActiveFlightsList({
  flights,
  drones = [],
  operators = [],
  onSelectFlight,
  selectedFlightId,
}: ActiveFlightsListProps) {
  const getSafetyColor = (safetyClass?: string) => {
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

  const getDroneName = (droneId: string) => {
    const drone = drones.find((d) => d.id === droneId);
    return drone ? drone.name : droneId;
  };

  const getOperatorName = (operatorId: string) => {
    const operator = operators.find((o) => o.id === operatorId);
    return operator ? operator.name : operatorId;
  };

  const getElapsedTime = (startTime: string) => {
    const elapsed = Date.now() - new Date(startTime).getTime();
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes} мин`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {flights.map((flight) => {
        const isSelected = selectedFlightId === flight.id;
        const safetyColor = getSafetyColor(flight.current_safety_class);

        return (
          <Box
            key={flight.id}
            onClick={() => onSelectFlight?.(flight.id)}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: isSelected
                ? alpha(colors.accent.primary, 0.1)
                : colors.background.tertiary,
              border: `1px solid ${isSelected ? colors.accent.primary : colors.border.default}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                borderColor: isSelected ? colors.accent.primary : colors.border.muted,
                backgroundColor: isSelected
                  ? alpha(colors.accent.primary, 0.15)
                  : alpha(colors.background.tertiary, 0.8),
              },
              '&::before': isSelected
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    backgroundColor: colors.accent.primary,
                    boxShadow: `0 0 10px ${colors.accent.primary}`,
                  }
                : {},
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Safety indicator */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: alpha(safetyColor, 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: safetyColor,
                  }}
                >
                  {flight.current_safety_index ? Math.round(flight.current_safety_index) : '--'}
                </Typography>
              </Box>

              {/* Flight info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    {flight.id}
                  </Typography>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: safetyColor,
                      boxShadow: `0 0 6px ${safetyColor}`,
                      animation:
                        flight.current_safety_class === 'red'
                          ? 'pulse-glow 0.5s ease-in-out infinite'
                          : 'pulse-glow 2s ease-in-out infinite',
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.text.secondary,
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  {getDroneName(flight.drone_id)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.text.muted,
                    fontSize: '0.7rem',
                  }}
                >
                  Оператор: {getOperatorName(flight.operator_id)}
                </Typography>
              </Box>

              {/* Time */}
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.text.muted,
                    fontSize: '0.65rem',
                    display: 'block',
                  }}
                >
                  В ПОЛЁТЕ
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: colors.accent.primary,
                  }}
                >
                  {getElapsedTime(flight.planned_start)}
                </Typography>
              </Box>
            </Box>

            {/* Warning indicator */}
            {flight.last_warning && (
              <Box
                sx={{
                  mt: 1.5,
                  pt: 1.5,
                  borderTop: `1px solid ${colors.border.default}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor:
                      flight.current_safety_class === 'red'
                        ? colors.safety.red
                        : colors.safety.yellow,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color:
                      flight.current_safety_class === 'red'
                        ? colors.safety.red
                        : colors.safety.yellow,
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {flight.last_warning.message}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
