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

interface FlightsSuccessChartProps {
  data: Array<{
    condition: string;
    success_rate: number;
    failed_rate: number;
  }>;
}

export default function FlightsSuccessChart({ data }: FlightsSuccessChartProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Успешность полётов vs погодные условия
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="condition" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="success_rate" fill="#22c55e" name="Успешно (%)" />
            <Bar dataKey="failed_rate" fill="#ef4444" name="Неудачно (%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

