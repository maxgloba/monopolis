// Восстанавливает сессию при старте приложения через refresh cookie
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    await authStore.refreshToken()
  }
})
