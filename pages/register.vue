<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: 'default' })

const authStore = useAuthStore()
const { error: toastError, success: toastSuccess } = useToast()
const router = useRouter()
const route  = useRoute()

const form = reactive({ email: '', nickname: '', password: '', confirm: '' })
const loading = ref(false)
const nicknameStatus = ref<'idle' | 'checking' | 'available' | 'taken'>('idle')
let nicknameTimer: ReturnType<typeof setTimeout>

const passwordStrength = computed(() => getPasswordStrength(form.password))

function getPasswordStrength(p: string): 'weak' | 'medium' | 'strong' {
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^a-zA-Z0-9]/.test(p)) score++
  if (p.length >= 12) score++
  if (score <= 2) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
}

function onNicknameInput() {
  clearTimeout(nicknameTimer)
  const n = form.nickname.trim()
  if (n.length < 3) { nicknameStatus.value = 'idle'; return }
  nicknameStatus.value = 'checking'
  nicknameTimer = setTimeout(async () => {
    const config = useRuntimeConfig()
    const res = await fetch(`${config.public.apiBaseUrl}/api/auth/check-nickname?n=${encodeURIComponent(n)}`)
    const json = await res.json()
    nicknameStatus.value = json.data?.available ? 'available' : 'taken'
  }, 500)
}

async function submit() {
  if (form.password !== form.confirm) { toastError('Пароли не совпадают'); return }
  if (nicknameStatus.value === 'taken') { toastError('Никнейм занят'); return }
  loading.value = true
  try {
    await authStore.register(form.email, form.nickname, form.password)
    toastSuccess('Регистрация успешна! Проверьте email.')
    router.push('/login')
  } catch (e: any) {
    toastError(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center py-10 px-6">
    <div class="relative w-full max-w-[400px] bg-noir-card border border-noir-border rounded-card px-8 py-9">
      <div class="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,theme(colors.gold.DEFAULT),transparent)]"></div>
      <h1 class="font-serif text-[22px] text-gold tracking-[3px] mb-2 text-center">Регистрация</h1>
      <p v-if="route.query.bonus" class="text-center text-[13px] text-gold mb-5 tracking-[1px]">+500 монет после регистрации</p>
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <UiInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autocomplete="email"
        />
        <div class="relative">
          <UiInput
            v-model="form.nickname"
            type="text"
            label="Никнейм"
            placeholder="буквы, цифры и _ (3–20 символов)"
            autocomplete="username"
            @input="onNicknameInput"
          />
          <span v-if="nicknameStatus === 'available'" class="block text-[11px] text-theme-football tracking-[1px] mt-1">✓ доступен</span>
          <span v-else-if="nicknameStatus === 'taken'" class="block text-[11px] text-theme-politics tracking-[1px] mt-1">✗ занят</span>
        </div>
        <div>
          <UiInput
            v-model="form.password"
            type="password"
            label="Пароль"
            placeholder="минимум 8 символов, A-Z и 0-9"
            :show-password-toggle="true"
            autocomplete="new-password"
          />
          <div class="flex gap-3 flex-wrap mt-1.5">
            <span :class="['text-[10px] tracking-[0.5px] transition-colors duration-[200ms]', form.password.length >= 8 ? 'text-theme-football' : 'text-ivory-faint']">• мин. 8 символов</span>
            <span :class="['text-[10px] tracking-[0.5px] transition-colors duration-[200ms]', /[A-Z]/.test(form.password) ? 'text-theme-football' : 'text-ivory-faint']">• заглавная буква (A-Z)</span>
            <span :class="['text-[10px] tracking-[0.5px] transition-colors duration-[200ms]', /[0-9]/.test(form.password) ? 'text-theme-football' : 'text-ivory-faint']">• цифра (0-9)</span>
          </div>
          <div v-if="form.password" class="flex gap-1 mt-1.5">
            <div
              class="flex-1 h-[3px] rounded-[2px] transition-all duration-[200ms]"
              :class="passwordStrength === 'weak' ? 'bg-theme-politics' : passwordStrength === 'medium' ? 'bg-gold' : 'bg-theme-football'"
            ></div>
            <div
              class="flex-1 h-[3px] rounded-[2px] transition-all duration-[200ms]"
              :class="passwordStrength === 'medium' ? 'bg-gold' : passwordStrength === 'strong' ? 'bg-theme-football' : 'bg-noir-border'"
            ></div>
            <div
              class="flex-1 h-[3px] rounded-[2px] transition-all duration-[200ms]"
              :class="passwordStrength === 'strong' ? 'bg-theme-football' : 'bg-noir-border'"
            ></div>
          </div>
        </div>
        <UiInput
          v-model="form.confirm"
          type="password"
          label="Подтверждение пароля"
          placeholder="повторите пароль"
          autocomplete="new-password"
        />
        <UiButton type="submit" :loading="loading" :full="true">Зарегистрироваться</UiButton>
        <p class="text-center text-[13px] text-ivory-muted">Уже есть аккаунт? <NuxtLink to="/login" class="text-gold">Войти</NuxtLink></p>
      </form>
    </div>
  </div>
</template>
