<script setup lang="ts">
definePageMeta({ middleware: 'guest', layout: 'default' })

const { error: toastError, success: toastSuccess } = useToast()
const config = useRuntimeConfig()

const email   = ref('')
const loading = ref(false)
const sent    = ref(false)

async function submit() {
  loading.value = true
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    sent.value = true
    toastSuccess('Если email зарегистрирован — письмо отправлено')
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
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <h1 class="font-serif text-[22px] text-gold tracking-[3px] mb-7 text-center">Сброс пароля</h1>
      <div v-if="sent" class="flex flex-col gap-3 text-ivory-muted text-sm leading-relaxed">
        <p>Письмо отправлено на <strong class="text-ivory">{{ email }}</strong>.</p>
        <p>Проверьте папку «Спам», если не нашли письмо.</p>
        <NuxtLink to="/login" class="text-[12px] text-gold-muted text-center tracking-[1px] hover:text-gold">← Вернуться к входу</NuxtLink>
      </div>
      <form v-else class="flex flex-col gap-4" @submit.prevent="submit">
        <UiInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          hint="Отправим ссылку для сброса пароля"
          autocomplete="email"
        />
        <UiButton type="submit" :loading="loading" :full="true">Отправить ссылку</UiButton>
        <NuxtLink to="/login" class="text-[12px] text-gold-muted text-center tracking-[1px] hover:text-gold">← Вернуться к входу</NuxtLink>
      </form>
    </div>
  </div>
</template>
