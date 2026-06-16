<template>
  <div class="min-h-screen bg-noir text-ivory">
    <main class="max-w-[800px] mx-auto px-6 pt-10 pb-16">
      <nav class="flex items-center gap-2 font-sans text-label tracking-[1px] uppercase text-ivory-muted mb-10">
        <NuxtLink to="/" class="text-ivory-muted no-underline transition-all duration-[150ms] hover:text-gold">Главная</NuxtLink>
        <span class="text-ivory-faint">/</span>
        <span>Контакты</span>
      </nav>

      <h1 class="font-serif text-imperial text-gold tracking-[2px] mb-10">Контакты</h1>

      <div class="grid grid-cols-2 gap-10 max-sm:grid-cols-1">
        <section>
          <h2 class="font-serif text-heading text-gold mb-4 pb-2 border-b border-noir-border">Как с нами связаться</h2>

          <ul class="list-none p-0 mb-6 flex flex-col gap-4">
            <li class="flex flex-col gap-[2px]">
              <span class="font-sans text-label uppercase tracking-[1.5px] text-ivory-muted">Email</span>
              <a href="mailto:support@monopolis.ru" class="font-sans text-[14px] text-gold no-underline border-b border-gold-dark transition-all duration-[150ms] w-fit hover:text-gold-light hover:border-gold-light">
                support@monopolis.ru
              </a>
            </li>
            <li class="flex flex-col gap-[2px]">
              <span class="font-sans text-label uppercase tracking-[1.5px] text-ivory-muted">Telegram</span>
              <a href="https://t.me/monopolis_support" target="_blank" rel="noopener" class="font-sans text-[14px] text-gold no-underline border-b border-gold-dark transition-all duration-[150ms] w-fit hover:text-gold-light hover:border-gold-light">
                @monopolis_support
              </a>
            </li>
            <li class="flex flex-col gap-[2px]">
              <span class="font-sans text-label uppercase tracking-[1.5px] text-ivory-muted">Рабочие часы</span>
              <span class="font-sans text-[14px] text-ivory">Пн–Пт, 10:00–18:00 МСК</span>
            </li>
          </ul>

          <p class="font-sans text-[14px] text-ivory-muted leading-[1.7]">
            В нерабочее время вы можете оставить сообщение — мы ответим в ближайший рабочий день.
          </p>
        </section>

        <section>
          <h2 class="font-serif text-heading text-gold mb-4 pb-2 border-b border-noir-border">Написать нам</h2>

          <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-1">
              <label class="font-sans text-label uppercase tracking-[1.5px] text-ivory-muted" for="name">Ваше имя</label>
              <UiInput
                id="name"
                v-model="form.name"
                placeholder="Как к вам обращаться"
                required
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-sans text-label uppercase tracking-[1.5px] text-ivory-muted" for="email">Email</label>
              <UiInput
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-sans text-label uppercase tracking-[1.5px] text-ivory-muted" for="message">Сообщение</label>
              <textarea
                id="message"
                v-model="form.message"
                class="w-full bg-noir-card border border-noir-border rounded-imperial text-ivory font-sans text-[14px] p-2 px-4 resize-y transition-all duration-[150ms] box-border placeholder:text-ivory-faint focus:outline-none focus:border-gold-muted"
                placeholder="Опишите ваш вопрос или проблему"
                rows="5"
                required
              />
            </div>

            <UiButton type="submit" :disabled="sending" class="self-start">
              {{ sending ? 'Отправляем...' : 'Отправить сообщение' }}
            </UiButton>

            <p v-if="sent" class="font-sans text-[14px] text-gold-light p-2 px-4 border border-gold-dark rounded-card bg-gold-faint">
              Сообщение отправлено. Мы свяжемся с вами в ближайшее время.
            </p>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Контакты — Монополис',
  meta: [{ name: 'description', content: 'Свяжитесь с командой Монополис по email или Telegram.' }],
})

const form = reactive({ name: '', email: '', message: '' })
const sending = ref(false)
const sent = ref(false)

async function onSubmit() {
  sending.value = true
  // TODO: integrate with backend contact endpoint
  await new Promise(r => setTimeout(r, 800))
  sending.value = false
  sent.value = true
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>
