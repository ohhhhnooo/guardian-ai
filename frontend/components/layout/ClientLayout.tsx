'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AppLayout from './AppLayout';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router, isPublicRoute, _hasHydrated]);

  // Показываем пустой экран до гидратации
  if (!_hasHydrated) {
    return null;
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
