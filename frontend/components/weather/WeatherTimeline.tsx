'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { ForecastPoint } from '@/types/domain';

interface WeatherTimelineProps {
  forecast: ForecastPoint[];
}

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
        return '#22c55e';
      case 'yellow':
        return '#eab308';
      case 'red':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Прогноз на {forecast.length} {forecast.length === 1 ? 'час' : 'часов'}
        </Typography>
        <Box sx={{ mb: 4 }}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis yAxisId="left" stroke="#f97316" />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                strokeWidth={2}
                name="Температура (°C)"
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="wind"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Ветер (м/с)"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            Индекс безопасности по времени
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="safety" name="Индекс безопасности">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSafetyColor(entry.safetyClass)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
