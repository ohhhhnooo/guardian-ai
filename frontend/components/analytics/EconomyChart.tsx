'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface EconomyChartProps {
  data: {
    savings_rub: number;
    losses_rub: number;
    roi_percent: number;
  };
}

export default function EconomyChart({ data }: EconomyChartProps) {
  const chartData = [
    { name: 'Экономия', value: data.savings_rub, color: '#22c55e' },
    { name: 'Потери', value: Math.abs(data.losses_rub), color: '#ef4444' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Экономические метрики
        </Typography>
        <Box sx={{ mb: 3 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value: number) => `${value.toFixed(0)} ₽`} />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Chip
            label={`ROI: ${data.roi_percent.toFixed(1)}%`}
            color={data.roi_percent > 0 ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`Чистая выгода: ${(data.savings_rub + data.losses_rub).toFixed(0)} ₽`}
            color={data.savings_rub + data.losses_rub > 0 ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

