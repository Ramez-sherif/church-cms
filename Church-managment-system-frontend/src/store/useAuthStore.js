import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(

  persist(

    (set, get) => ({

      // =========================
      // Auth State
      // =========================
      user: null,

      accessToken: null,

      refreshToken: null,

      isAuthenticated: false,

      // =========================
      // Set Tokens
      // =========================
      setAuth: (
        accessToken,
        refreshToken
      ) => set({

        accessToken,

        refreshToken,

        isAuthenticated: !!accessToken
      }),

      // =========================
      // Set Current User
      // =========================
      setUser: (user) => set({

        user
      }),

      // =========================
      // Helpers
      // =========================
      isTeacher: () => {

        return get().user?.role === 'TEACHER';
      },

      isFather: () => {

        return get().user?.role === 'FATHER';
      },

      isStudent: () => {

        return get().user?.role === 'STUDENT';
      },

      // =========================
      // Service Roles
      // =========================
      isGeneralAdmin: () => {

        return get().user?.serviceRole
          === 'GENERAL_ADMIN';
      },

      isStageAdmin: () => {

        return get().user?.serviceRole
          === 'STAGE_ADMIN';
      },

      isStageLeader: () => {

        return get().user?.serviceRole
          === 'STAGE_LEADER';
      },

      isAssistantStageLeader: () => {

        return get().user?.serviceRole
          === 'ASSISTANT_STAGE_LEADER';
      },

      isStageGroupLeader: () => {

        return get().user?.serviceRole
          === 'STAGE_GROUP_LEADER';
      },

      isAssistantStageGroupLeader: () => {

        return get().user?.serviceRole
          === 'ASSISTANT_STAGE_GROUP_LEADER';
      },

      isClassServant: () => {

        return get().user?.serviceRole
          === 'CLASS_SERVANT';
      },

      // =========================
      // Logout
      // =========================
      logout: async () => {

        const { refreshToken } = get();

        try {

          const {
            default: axiosInstance
          } = await import(
            '../api/axiosInstance'
          );

          await axiosInstance.post(
            '/auth/logout',
            { refreshToken }
          );

        } catch (error) {

          console.error(
            'Logout failed:',
            error
          );

        } finally {

          localStorage.removeItem(
            'auth-storage'
          );

          set({

            user: null,

            accessToken: null,

            refreshToken: null,

            isAuthenticated: false
          });
        }
      },
    }),

    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;