import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, FilterOptions } from '@/types';

interface AppState {
  user: any | null;
  token: string | null;
  notifications: Notification[];
  filters: FilterOptions;
  setUser: (user: any | null) => void;
  setToken: (token: string | null) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: number) => void;
  setFilters: (filters: FilterOptions) => void;
}

export const useStore = create<AppState>()(persist(
  (set) => ({
    user: null,
    token: null,
    notifications: [],
    filters: {},
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    addNotification: (notification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),
    markNotificationRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
      })),
    setFilters: (filters) => set({ filters }),
  }),
  { name: 'app-store' }
));
