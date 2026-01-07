'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOperators, createOperator, updateOperator, deleteOperator } from '@/lib/api/operatorsApi';
import { Operator } from '@/types/domain';

export default function OperatorsPage() {
  const [open, setOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState<{
    name: string,
    email: string,
    role: 'operator' | 'senior_operator' | 'admin',
    status: 'active' | 'inactive',
  }>({
    name: '',
    email: '',
    role: 'operator',
    status: 'active',
  })

  const queryClient = useQueryClient();
  const { data: operators, isLoading } = useQuery({
    queryKey: ['operators'],
    queryFn: getOperators,
  });

  const createMutation = useMutation({
    mutationFn: createOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      setOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Operator> }) => updateOperator(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      setOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'operator', status: 'active' });
    setEditingOperator(null);
  };

  const handleOpen = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormData({
        name: operator.name,
        email: operator.email,
        role: 'operator',
        status: operator.status,
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
    if (editingOperator) {
      updateMutation.mutate({ id: editingOperator.id, data: formData });
    } else {
      createMutation.mutate(formData as any);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Управление операторами
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Добавить оператора
        </Button>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>Загрузка...</Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Имя</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {operators?.map((operator) => (
                    <TableRow key={operator.id}>
                      <TableCell>{operator.name}</TableCell>
                      <TableCell>{operator.email}</TableCell>
                      <TableCell>{operator.role}</TableCell>
                      <TableCell>
                        <Chip
                          label={operator.status === 'active' ? 'Активен' : 'Неактивен'}
                          color={operator.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpen(operator)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (confirm('Удалить оператора?')) {
                              deleteMutation.mutate(operator.id);
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingOperator ? 'Редактировать оператора' : 'Добавить оператора'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Имя"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'operator' | 'senior_operator' | 'admin'})}
                label="Роль"
              >
                <MenuItem value="operator">Оператор</MenuItem>
                <MenuItem value="senior_operator">Старший оператор</MenuItem>
                <MenuItem value="admin">Администратор</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                label="Статус"
              >
                <MenuItem value="active">Активен</MenuItem>
                <MenuItem value="inactive">Неактивен</MenuItem>
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
            {editingOperator ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
