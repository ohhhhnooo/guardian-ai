'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Flight } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDrones, createDrone, updateDrone, deleteDrone } from '@/lib/api/dronesApi';
import { Drone } from '@/types/domain';

export default function DronesPage() {
  const [open, setOpen] = useState(false);
  const [editingDrone, setEditingDrone] = useState<Drone | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    model: string;
    serial_number: string;
    status: 'active' | 'maintenance';
  }>({
    name: '',
    model: '',
    serial_number: '',
    status: 'active',
  });

  const queryClient = useQueryClient();
  const { data: drones, isLoading } = useQuery({
    queryKey: ['drones'],
    queryFn: getDrones,
  });

  const createMutation = useMutation({
    mutationFn: createDrone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drones'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Drone> }) => updateDrone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drones'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDrone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drones'] });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', model: '', serial_number: '', status: 'active' });
    setEditingDrone(null);
  };

  const handleOpen = (drone?: Drone) => {
    if (drone) {
      setEditingDrone(drone);
      setFormData({
        name: drone.name,
        model: drone.model,
        serial_number: drone.serial_number,
        status: 'active',
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (editingDrone) {
      updateMutation.mutate({ id: editingDrone.id, data: formData });
    } else {
      createMutation.mutate(formData as any);
    }
  };

  // Список доступных моделей (можно вынести в отдельный файл)
  const availableModels = [
    'DJI Mavic 3 Enterprise',
    'DJI Matrice 300 RTK',
    'DJI Phantom 4 Pro',
    'DJI Mini 3 Pro',
    'Autel EVO II',
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Управление дронами
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Добавить дрон
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>Загрузка...</Box>
      ) : (
        <Grid container spacing={3}>
          {drones?.map((drone) => (
            <Grid item xs={12} sm={6} md={4} key={drone.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Flight sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleOpen(drone)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (confirm('Удалить дрон?')) {
                            deleteMutation.mutate(drone.id);
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {drone.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {drone.model}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    S/N: {drone.serial_number}
                  </Typography>
                  <Chip
                    label={drone.status === 'active' ? 'Активен' : 'На обслуживании'}
                    color={drone.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDrone ? 'Редактировать дрон' : 'Добавить дрон'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Название"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Модель</InputLabel>
              <Select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                label="Модель"
              >
                {availableModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Серийный номер"
              fullWidth
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select<'active' | 'maintenance'>
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'maintenance',
                  })
                }
                label="Статус"
              >
                <MenuItem value="active">Активен</MenuItem>
                <MenuItem value="maintenance">На обслуживании</MenuItem>
              </Select>
            </FormControl>
            {(createMutation.isError || updateMutation.isError) && (
              <Alert severity="error">Ошибка при сохранении</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingDrone ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
