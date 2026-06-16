import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware(async () => {
  // refreshToken делает fetch — работает только на клиенте
  if (import.meta.server) return

  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    const ok = await authStore.refreshToken()
    if (!ok) return navigateTo('/login')
  }
})
