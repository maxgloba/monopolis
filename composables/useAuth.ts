import { useAuthStore } from '~/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  return {
    user:            computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    login:           authStore.login,
    register:        authStore.register,
    logout:          authStore.logout,
    fetchMe:         authStore.fetchMe,
  }
}
