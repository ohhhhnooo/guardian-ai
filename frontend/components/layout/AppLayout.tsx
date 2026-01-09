'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Dashboard,
  Flight,
  People,
  BarChart,
  Settings,
  Logout,
  Notifications,
  AccountCircle,
  Radar,
  FlightTakeoff,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/theme';

const drawerWidth = 260;

const menuItems = [
  { id: '/', label: 'Главная', icon: Home, description: 'Проверка условий' },
  { id: '/dashboard', label: 'Дашборд', icon: Dashboard, description: 'Обзор системы' },
  { id: '/flights', label: 'Полёты', icon: FlightTakeoff, description: 'Планирование' },
  { id: '/monitoring', label: 'Мониторинг', icon: Radar, description: 'Активные полёты' },
  { id: '/drones', label: 'Дроны', icon: Flight, description: 'Управление парком' },
  { id: '/operators', label: 'Операторы', icon: People, description: 'Команда' },
  { id: '/analytics', label: 'Аналитика', icon: BarChart, description: 'Статистика' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    handleMenuClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${alpha(colors.accent.primary, 0.3)}`,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
              stroke={colors.background.primary}
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="12" cy="11" r="3" fill={colors.background.primary} />
          </svg>
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              fontSize: '1rem',
              lineHeight: 1.2,
            }}
          >
            Guardian AI
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: colors.text.muted,
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
            }}
          >
            ПОГОДНЫЕ УСЛОВИЯ <br />
            ДЛЯ ДРОНОВ
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2, overflow: 'auto' }}>
        <Typography
          variant="overline"
          sx={{
            px: 2.5,
            py: 1,
            display: 'block',
            color: colors.text.muted,
            fontSize: '0.65rem',
          }}
        >
          Навигация
        </Typography>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    router.push(item.id);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    px: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: colors.accent.primary,
                      boxShadow: `0 0 10px ${colors.accent.primary}`,
                    } : {},
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon
                      sx={{
                        fontSize: 20,
                        color: isActive ? colors.accent.primary : colors.text.secondary,
                        transition: 'color 0.2s ease',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      color: colors.text.muted,
                      sx: { mt: 0.25 },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Section */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${colors.border.default}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: alpha(colors.accent.primary, 0.05),
            border: `1px solid ${colors.border.default}`,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: colors.accent.secondary,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: colors.text.primary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'Пользователь'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.text.muted,
                fontSize: '0.7rem',
              }}
            >
              {user?.role === 'admin' ? 'Администратор' : 'Оператор'}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => router.push('/account')}
            sx={{
              color: colors.text.secondary,
              '&:hover': {
                color: colors.accent.primary,
                backgroundColor: alpha(colors.accent.primary, 0.1),
              },
            }}
          >
            <Settings sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background.primary }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Status indicator */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: '20px',
              backgroundColor: alpha(colors.safety.green, 0.1),
              border: `1px solid ${alpha(colors.safety.green, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: colors.safety.green,
                boxShadow: `0 0 8px ${colors.safety.green}`,
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: colors.safety.green,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              ONLINE
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}
          <IconButton
            sx={{
              color: colors.text.secondary,
              '&:hover': {
                color: colors.accent.primary,
                backgroundColor: alpha(colors.accent.primary, 0.1),
              },
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: colors.safety.red,
                  color: colors.background.primary,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <Notifications sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>

          {/* User menu */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: colors.accent.secondary,
                fontSize: '0.875rem',
                fontWeight: 600,
                border: `2px solid ${alpha(colors.accent.primary, 0.3)}`,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 1 }}
          >
            <Box sx={{ px: 2, py: 1.5, minWidth: 180 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                {user?.name || 'Пользователь'}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.muted }}>
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                router.push('/account');
                handleMenuClose();
              }}
            >
              <AccountCircle sx={{ mr: 1.5, fontSize: 20, color: colors.text.secondary }} />
              Профиль
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: colors.safety.red }}>
              <Logout sx={{ mr: 1.5, fontSize: 20 }} />
              Выйти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: colors.background.secondary,
              borderRight: `1px solid ${colors.border.default}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: colors.background.secondary,
              borderRight: `1px solid ${colors.border.default}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
