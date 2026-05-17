import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (accessToken, refreshToken) => set({ 
        accessToken, 
        refreshToken, 
        isAuthenticated: !!accessToken 
      }),

      setUser: (user) => set({ user }),

      logout: async () => {
        const { refreshToken } = useAuthStore.getState();
        try {
          const { default: axiosInstance } = await import('../api/axiosInstance');
          await axiosInstance.post('/auth/logout', { refreshToken });
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          localStorage.removeItem('auth-storage');
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
