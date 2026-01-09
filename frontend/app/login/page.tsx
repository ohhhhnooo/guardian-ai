'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/theme';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: colors.background.primary,
      }}
    >
      {/* Animated background grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${alpha(colors.accent.primary, 0.03)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(colors.accent.primary, 0.03)} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      {/* Glowing orb effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.accent.primary, 0.15)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />

      {/* Left side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          p: 6,
        }}
      >
        {/* Animated rings */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: `1px solid ${alpha(colors.accent.primary, 0.2)}`,
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: `1px solid ${alpha(colors.accent.primary, 0.1)}`,
            animation: 'pulse-glow 3s ease-in-out infinite 0.5s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            border: `1px solid ${alpha(colors.accent.primary, 0.05)}`,
            animation: 'pulse-glow 3s ease-in-out infinite 1s',
          }}
        />

        {/* Logo icon */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 60px ${alpha(colors.accent.primary, 0.4)}`,
              mb: 3,
            }}
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                stroke={colors.background.primary}
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M12 6L8 8.5V13.5L12 16L16 13.5V8.5L12 6Z"
                fill={colors.background.primary}
              />
              <circle cx="12" cy="11" r="2" fill={colors.accent.primary} />
            </svg>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colors.text.primary} 0%, ${colors.accent.primary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Guardian AI
          </Typography>

          <Typography
            sx={{
              color: colors.text.secondary,
              textAlign: 'center',
              maxWidth: 300,
              lineHeight: 1.6,
            }}
          >
            Интеллектуальная система планирования полётов дронов с учётом погодных условий
          </Typography>
        </Box>

        {/* Stats/features row */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            mt: 6,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {[
            { value: '99.2%', label: 'Точность прогноза' },
            { value: '< 1s', label: 'Время ответа' },
            { value: '24/7', label: 'Мониторинг' },
          ].map((stat, i) => (
            <Box key={i} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: colors.accent.primary,
                  textShadow: `0 0 20px ${alpha(colors.accent.primary, 0.5)}`,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: colors.text.muted,
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right side - Login form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0 },
          width: { md: '480px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            backgroundColor: alpha(colors.background.card, 0.8),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border.default}`,
            borderRadius: 3,
            p: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${colors.accent.primary}, transparent)`,
            },
          }}
        >
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.accent.primary,
                mb: 1,
              }}
            >
              Guardian AI
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              Планирование полётов дронов
            </Typography>
          </Box>

          <Typography
            variant="overline"
            sx={{
              color: colors.accent.primary,
              display: 'block',
              mb: 1,
            }}
          >
            Авторизация
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            Добро пожаловать
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              mb: 4,
            }}
          >
            Введите данные для входа в систему
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2.5 }}
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: colors.background.primary }} />
              ) : (
                'Войти в систему'
              )}
            </Button>

            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: `1px solid ${colors.border.default}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Нет аккаунта?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => router.push('/register')}
                  sx={{
                    color: colors.accent.primary,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom status indicator */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: colors.safety.green,
              boxShadow: `0 0 10px ${colors.safety.green}`,
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: colors.text.muted,
              letterSpacing: '0.05em',
            }}
          >
            Система работает в штатном режиме
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
