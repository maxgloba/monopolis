<script setup lang="ts">
definePageMeta({ layout: 'default' })

const config = useRuntimeConfig()
const route  = useRoute()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) { status.value = 'error'; message.value = 'Токен отсутствует'; return }
  try {
    const res  = await fetch(`${config.public.apiBaseUrl}/api/auth/verify-email?token=${token}`)
    const json = await res.json()
    if (json.error) { status.value = 'error'; message.value = json.error.message; return }
    status.value = 'success'
    message.value = json.data.message

    const authStore = useAuthStore()
    if (authStore.isAuthenticated) await authStore.fetchMe()
  } catch {
    status.value = 'error'
    message.value = 'Ошибка при подтверждении'
  }
})
</script>

<template>
  <div class="flex flex-1 items-center justify-center py-10 px-6">
    <div class="relative w-full max-w-[400px] bg-noir-card border border-noir-border rounded-card px-8 py-9">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <div v-if="status === 'loading'" class="flex flex-col items-center gap-4 text-center">
        <div class="w-10 h-10 rounded-full border-[3px] border-noir-border border-t-gold animate-spin"></div>
        <p class="text-ivory-muted text-[14px]">Проверяем токен...</p>
      </div>

      <div v-else-if="status === 'success'" class="flex flex-col items-center gap-4 text-center">
        <div class="w-12 h-12 rounded-full border-2 border-theme-football bg-theme-football/10 flex items-center justify-center text-[20px] font-bold text-theme-football">✓</div>
        <h2 class="font-serif text-[20px] text-gold tracking-[2px]">Email подтверждён!</h2>
        <p class="text-ivory-muted text-[14px]">{{ message }}</p>
        <NuxtLink to="/login"><UiButton :full="true">Войти в аккаунт</UiButton></NuxtLink>
      </div>

      <div v-else class="flex flex-col items-center gap-4 text-center">
        <div class="w-12 h-12 rounded-full border-2 border-theme-politics bg-theme-politics/10 flex items-center justify-center text-[20px] font-bold text-theme-politics">✕</div>
        <h2 class="font-serif text-[20px] text-gold tracking-[2px]">Ошибка</h2>
        <p class="text-ivory-muted text-[14px]">{{ message }}</p>
        <NuxtLink to="/login"><UiButton variant="ghost" :full="true">Вернуться к входу</UiButton></NuxtLink>
      </div>
    </div>
  </div>
</template>
