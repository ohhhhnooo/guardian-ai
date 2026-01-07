'use client';

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DowntimeChartProps {
  data: Array<{
    period: string;
    cancellations: number;
    postponements: number;
  }>;
}

export default function DowntimeChart({ data }: DowntimeChartProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Простои из-за погоды
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="cancellations" fill="#f97316" name="Отмены" />
            <Bar dataKey="postponements" fill="#eab308" name="Переносы" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

