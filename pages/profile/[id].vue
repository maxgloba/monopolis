<script setup lang="ts">
const route = useRoute()
const { success } = useToast()
const config = useRuntimeConfig()

const { data: referral, refresh } = await useFetch<{
  url: string
  code: string
  count: number
  earnedCoins: number
}>('/api/referral/my-link', { baseURL: config.public.apiBaseUrl, credentials: 'include' })

async function copyLink() {
  if (!referral.value?.url) return
  await navigator.clipboard.writeText(referral.value.url)
  success('Ссылка скопирована')
}
</script>

<template>
  <div class="max-w-[800px] mx-auto py-10 px-6">
    <h1 class="font-serif text-[28px] text-gold tracking-[3px] uppercase mb-10">Профиль</h1>

    <section class="relative bg-noir-card border border-noir-border rounded-card p-7">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <h2 class="font-serif text-[18px] text-gold tracking-[2px] mb-6">Реферальная программа</h2>

      <div class="flex gap-8 mb-6">
        <div class="text-center">
          <div class="font-serif text-[32px] text-gold font-bold">{{ referral?.count ?? 0 }}</div>
          <div class="text-label text-ivory-faint tracking-[2px] uppercase mt-1">Друзей приглашено</div>
        </div>
        <div class="text-center">
          <div class="font-serif text-[32px] text-gold font-bold">{{ referral?.earnedCoins ?? 0 }}</div>
          <div class="text-label text-ivory-faint tracking-[2px] uppercase mt-1">Монет заработано</div>
        </div>
      </div>

      <div v-if="referral" class="flex items-center gap-3 bg-noir-surface border border-noir-border rounded-imperial px-4 py-3 mb-4">
        <div class="flex-1 text-[13px] text-ivory-muted overflow-hidden text-ellipsis whitespace-nowrap">{{ referral.url }}</div>
        <button
          class="inline-flex items-center px-[18px] py-2 bg-gradient-to-br from-gold to-gold-dark text-noir border-none rounded-imperial text-[10px] font-bold tracking-[2px] uppercase cursor-pointer whitespace-nowrap transition-all duration-[150ms] flex-shrink-0 hover:opacity-90 active:scale-[0.98]"
          @click="copyLink"
        >Скопировать</button>
      </div>

      <p class="text-[13px] text-ivory-faint leading-[1.6]">
        За каждого приглашённого друга вы получаете <span class="text-gold">500 монет</span> после подтверждения его email.
      </p>
    </section>
  </div>
</template>
