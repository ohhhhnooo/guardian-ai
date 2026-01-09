'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { ForecastPoint } from '@/types/domain';
import { colors } from '@/theme/theme';

interface WeatherTimelineProps {
  forecast: ForecastPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: colors.background.elevated,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 2,
          p: 1.5,
          minWidth: 120,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            color: colors.text.muted,
            mb: 1,
          }}
        >
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: entry.color,
              }}
            >
              {entry.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

export default function WeatherTimeline({ forecast }: WeatherTimelineProps) {
  const data = forecast.map((point) => ({
    time: new Date(point.time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    hour: new Date(point.time).getHours(),
    temp: point.temp_c,
    wind: point.wind_speed_mps,
    gusts: point.wind_gust_mps,
    safety: point.safety_index,
    safetyClass: point.safety_class,
  }));

  const getSafetyColor = (safetyClass: string) => {
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
              backgroundColor: colors.accent.primary,
              boxShadow: `0 0 12px ${colors.accent.primary}`,
            }}
          />
          <Typography
            variant="overline"
            sx={{
              color: colors.text.muted,
              fontSize: '0.65rem',
            }}
          >
            ПРОГНОЗ НА {forecast.length} {forecast.length === 1 ? 'ЧАС' : 'ЧАСОВ'}
          </Typography>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          {[
            { label: 'Температура', color: '#ff6b6b' },
            { label: 'Ветер', color: colors.accent.primary },
          ].map((item, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 3,
                  borderRadius: 1,
                  backgroundColor: item.color,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary, fontSize: '0.7rem' }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Line Chart */}
        <Box sx={{ mb: 4 }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.border.default}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke={colors.text.muted}
                tick={{ fontSize: 11, fill: colors.text.muted }}
                axisLine={{ stroke: colors.border.default }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke={colors.text.muted}
                tick={{ fontSize: 11, fill: colors.text.muted }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={colors.text.muted}
                tick={{ fontSize: 11, fill: colors.text.muted }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                stroke="#ff6b6b"
                strokeWidth={2}
                name="Температура (°C)"
                dot={{ r: 3, fill: '#ff6b6b', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#ff6b6b', stroke: colors.background.primary, strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="wind"
                stroke={colors.accent.primary}
                strokeWidth={2}
                name="Ветер (м/с)"
                dot={{ r: 3, fill: colors.accent.primary, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: colors.accent.primary, stroke: colors.background.primary, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Safety Index Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.border.default}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke={colors.text.muted}
                tick={{ fontSize: 11, fill: colors.text.muted }}
                axisLine={{ stroke: colors.border.default }}
                tickLine={false}
              />
              <YAxis
                stroke={colors.text.muted}
                tick={{ fontSize: 11, fill: colors.text.muted }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="safety"
                name="Индекс безопасности"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getSafetyColor(entry.safetyClass)}
                    style={{
                      filter: `drop-shadow(0 0 4px ${alpha(getSafetyColor(entry.safetyClass), 0.3)})`,
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Footer legend */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${colors.border.default}`,
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {[
            { label: 'Безопасно (80+)', color: colors.safety.green },
            { label: 'Внимание (60-79)', color: colors.safety.yellow },
            { label: 'Опасно (<60)', color: colors.safety.red },
          ].map((item, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: item.color,
                  boxShadow: `0 0 6px ${alpha(item.color, 0.5)}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: colors.text.muted, fontSize: '0.7rem' }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
