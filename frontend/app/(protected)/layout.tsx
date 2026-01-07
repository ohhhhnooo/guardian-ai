'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router, _hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
    return null;
  }

  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
