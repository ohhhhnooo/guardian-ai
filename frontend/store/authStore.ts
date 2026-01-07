'use client';

import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { User } from '@/types/domain';
import { login as apiLogin, register as apiRegister } from '@/lib/api/authApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Создаем store только на клиенте (не на уровне модуля!)
const createStore = (): UseBoundStore<StoreApi<AuthState>> => {
  // На сервере возвращаем заглушку БЕЗ вызова create
  if (typeof window === 'undefined') {
    return {
      getState: () => ({
        user: null,
        isAuthenticated: false,
        _hasHydrated: true,
        login: async () => {},
        register: async () => {},
        logout: () => {},
        setHasHydrated: () => {},
      }),
      setState: () => {},
      subscribe: () => () => {},
      destroy: () => {},
    } as any;
  }

  // На клиенте создаем реальный store
  return create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  _hasHydrated: false,
  setHasHydrated: (state: boolean) => {
    set({ _hasHydrated: state });
  },
  login: async (email: string, password: string) => {
    const user = await apiLogin(email, password);
    set({ user, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth-storage', JSON.stringify({ user, isAuthenticated: true }));
      } catch {
        // Ignore
      }
    }
  },
  register: async (name: string, email: string, password: string) => {
    const user = await apiRegister({ name, email, password });
    set({ user, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth-storage', JSON.stringify({ user, isAuthenticated: true }));
      } catch {
        // Ignore
      }
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth-storage');
      } catch {
        // Ignore
      }
    }
      },
    }));
};

// Ленивая инициализация store - создается только на клиенте
let store: UseBoundStore<StoreApi<AuthState>> | null = null;

const getStore = (): UseBoundStore<StoreApi<AuthState>> => {
  // На сервере всегда возвращаем заглушку
  if (typeof window === 'undefined') {
    return {
      getState: () => ({
        user: null,
        isAuthenticated: false,
        _hasHydrated: true,
        login: async () => {},
        register: async () => {},
        logout: () => {},
        setHasHydrated: () => {},
      }),
      setState: () => {},
      subscribe: () => () => {},
      destroy: () => {},
    } as any;
  }

  // На клиенте создаем store один раз
  if (!store) {
    store = createStore();
    // Гидратация
    store.getState().setHasHydrated(true);

    // Загружаем из localStorage асинхронно
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.user && parsed.isAuthenticated) {
            store!.setState({
              user: parsed.user,
              isAuthenticated: parsed.isAuthenticated,
            });
          }
        }
      } catch {
        // Ignore
      }
    }, 0);
  }

  return store;
};

// Хук для использования store
export const useAuthStore = <T = AuthState>(
  selector?: (state: AuthState) => T
): T => {
  const store = getStore();

  if (typeof window === 'undefined') {
    // На сервере возвращаем дефолтное состояние
    const defaultState: AuthState = {
      user: null,
      isAuthenticated: false,
      _hasHydrated: true,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      setHasHydrated: () => {},
    };
    return (selector ? selector(defaultState) : defaultState) as T;
  }

  // На клиенте используем реальный store
  if (selector) {
    return store(selector);
  }
  return store() as T;
};
