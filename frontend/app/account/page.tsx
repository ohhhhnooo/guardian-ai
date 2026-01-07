'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { AccountCircle, Email, Badge } from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

export default function AccountPage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Личный кабинет
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: 48,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Администратор' : 'Оператор'}
                color={user.role === 'admin' ? 'primary' : 'default'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Информация о профиле
              </Typography>
              <List>
                <ListItem>
                  <AccountCircle sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Имя" secondary={user.name} />
                </ListItem>
                <Divider />
                <ListItem>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <Divider />
                <ListItem>
                  <Badge sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText primary="Роль" secondary={user.role === 'admin' ? 'Администратор' : 'Оператор'} />
                  <ListItemSecondaryAction>
                    <Chip
                      label={user.role === 'admin' ? 'Админ' : 'Оператор'}
                      size="small"
                      color={user.role === 'admin' ? 'primary' : 'default'}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Управление
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Управление операторами и дронами доступно в соответствующих разделах меню.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

