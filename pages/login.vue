<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: 'default' })

const authStore = useAuthStore()
const { error: toastError } = useToast()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)

const vkLoginUrl = import.meta.dev
  ? 'http://localhost:3001/api/auth/vk/dev-login'
  : '/api/auth/vk'

async function submit() {
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch (e: any) {
    toastError(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center px-6 py-10">
    <div class="relative w-full max-w-[400px] bg-noir-card border border-noir-border rounded-card px-8 py-9">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      <h1 class="font-serif text-[22px] text-gold tracking-[3px] mb-7 text-center">Вход</h1>
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <UiInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autocomplete="email"
        />
        <UiInput
          v-model="form.password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          :show-password-toggle="true"
          autocomplete="current-password"
        />
        <NuxtLink to="/forgot-password" class="text-[12px] text-gold-muted text-right tracking-[1px] hover:text-gold">Забыли пароль?</NuxtLink>
        <UiButton type="submit" :loading="loading" :full="true">Войти</UiButton>
        <div class="flex items-center gap-3 text-ivory-faint text-[12px] tracking-[2px] before:content-[''] before:flex-1 before:h-px before:bg-noir-border after:content-[''] after:flex-1 after:h-px after:bg-noir-border"><span>или</span></div>
        <a :href="vkLoginUrl" class="flex items-center justify-center gap-[10px] py-[11px] bg-[#0077FF] text-white rounded-imperial text-[13px] tracking-[1px] no-underline hover:opacity-90">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z"/></svg>
          Войти через ВКонтакте
        </a>
        <p class="text-center text-[13px] text-ivory-muted"><NuxtLink to="/register" class="text-gold">Зарегистрироваться</NuxtLink></p>
      </form>
    </div>
  </div>
</template>
