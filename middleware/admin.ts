export default defineNuxtRouteMiddleware(() => {
  const user = useState<{ role: string } | null>('user')
  if (!user.value || !['finance_admin', 'super_admin'].includes(user.value.role)) {
    return navigateTo('/')
  }
})
