<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: 'default' })

const { error: toastError, success: toastSuccess } = useToast()
const config = useRuntimeConfig()
const router = useRouter()
const route  = useRoute()

const form    = reactive({ password: '', confirm: '' })
const loading = ref(false)

async function submit() {
  if (form.password !== form.confirm) { toastError('Пароли не совпадают'); return }
  loading.value = true
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: route.query.token, password: form.password }),
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    toastSuccess('Пароль изменён')
    router.push('/login')
  } catch (e: any) {
    toastError(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-center">
  <div class="auth-card">
      <h1 class="auth-title">Новый пароль</h1>
      <form class="auth-form" @submit.prevent="submit">
        <UiInput
          v-model="form.password"
          type="password"
          label="Новый пароль"
          placeholder="минимум 8 символов, A-Z и 0-9"
          :show-password-toggle="true"
          autocomplete="new-password"
        />
        <UiInput
          v-model="form.confirm"
          type="password"
          label="Подтверждение пароля"
          placeholder="повторите пароль"
          autocomplete="new-password"
        />
        <UiButton type="submit" :loading="loading" :full="true">Сохранить пароль</UiButton>
      </form>
  </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.auth-card {
  position: relative;
  width: 100%; max-width: 400px;
  background: $noir-card; border: 1px solid $noir-border; border-radius: $radius-card; padding: 36px 32px;
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, $gold, transparent); }
}
.auth-title { font-family: $font-serif; font-size: 22px; color: $gold; letter-spacing: 3px; margin-bottom: 28px; text-align: center; }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
</style>
