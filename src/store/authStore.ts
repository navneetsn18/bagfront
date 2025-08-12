import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true });
    // Store in localStorage
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(user));
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  },
}));