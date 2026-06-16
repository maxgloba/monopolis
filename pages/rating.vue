<script setup lang="ts">
const authStore = useAuthStore()
const config    = useRuntimeConfig()
const router    = useRouter()

const page    = ref(1)
const perPage = 50

const { data, pending, refresh } = useFetch('/api/rating', {
  baseURL: config.public.apiBaseUrl,
  query:   computed(() => ({ page: page.value, per_page: perPage })),
})

const players  = computed(() => data.value?.players  ?? [])
const total    = computed(() => data.value?.total     ?? 0)
const hasMore  = computed(() => page.value * perPage < total.value)

const rankMeta: Record<number, { label: string; cls: string }> = {
  1: { label: '1', cls: 'rank-gold'   },
  2: { label: '2', cls: 'rank-silver' },
  3: { label: '3', cls: 'rank-bronze' },
}

function isCurrentUser(player: any): boolean {
  return authStore.isAuthenticated && authStore.user?.id === player.id
}

function loadMore() {
  page.value++
}

watch(page, () => refresh())
</script>

<template>
  <div class="min-h-screen bg-noir text-ivory py-12 px-6">
    <div class="max-w-[800px] mx-auto">
      <h1 class="font-serif text-[28px] tracking-[6px] text-gold text-center mb-10">РЕЙТИНГ ИГРОКОВ</h1>

      <div v-if="!authStore.isAuthenticated" class="flex items-center justify-between gap-4 px-6 py-4 bg-gold/[0.06] border border-gold/25 rounded-imperial mb-8">
        <span class="text-[13px] tracking-[1px] text-ivory-muted">Войди чтобы попасть в рейтинг</span>
        <UiButton size="sm" @click="router.push('/login')">Войти</UiButton>
      </div>

      <template v-if="pending && players.length === 0">
        <div class="flex flex-col gap-0.5">
          <div v-for="i in 10" :key="i" class="flex items-center gap-4 px-4 py-[14px] bg-noir-card border-b border-noir-border">
            <div class="skel w-7 h-7 rounded-full" />
            <div class="skel w-8 h-8 rounded-full shrink-0" />
            <div class="skel w-40 h-[14px] rounded" />
            <div class="skel w-20 h-[14px] rounded ml-auto" />
          </div>
        </div>
      </template>

      <table v-else class="w-full border-collapse">
        <thead>
          <tr class="border-b border-noir-border">
            <th class="w-14 text-center px-4 py-[10px] text-[10px] tracking-[2px] uppercase text-ivory-faint text-left">#</th>
            <th class="px-4 py-[10px] text-[10px] tracking-[2px] uppercase text-ivory-faint text-left">Игрок</th>
            <th class="w-[140px] text-right px-4 py-[10px] text-[10px] tracking-[2px] uppercase text-ivory-faint text-left">Монеты</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(player, index) in players"
            :key="player.id"
            class="bg-noir-card border-b border-noir-border transition-all duration-[150ms] hover:bg-ivory/[0.03]"
            :class="[
              rankMeta[player.rank]?.cls,
              { 'row-me': isCurrentUser(player) },
            ]"
          >
            <td class="w-14 text-center px-4 py-3 align-middle">
              <UiBadge
                v-if="player.rank <= 3"
                :variant="player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : 'bronze'"
                size="sm"
              >
                {{ player.rank }}
              </UiBadge>
              <span v-else class="text-[13px] text-ivory-muted">{{ player.rank }}</span>
            </td>
            <td class="px-4 py-3 align-middle">
              <div class="flex items-center gap-3">
                <UiAvatar :name="player.nickname" :src="player.avatarUrl" size="sm" />
                <span class="player-nick text-[14px] tracking-[0.5px] text-ivory">{{ player.nickname }}</span>
                <span v-if="isCurrentUser(player)" class="text-[9px] tracking-[2px] text-gold border border-gold/40 rounded-imperial px-[5px] py-px">ВЫ</span>
              </div>
            </td>
            <td class="w-[140px] text-right px-4 py-3 align-middle">
              <span class="text-[14px] tabular-nums text-ivory">{{ player.coins.toLocaleString('ru-RU') }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="hasMore" class="flex justify-center mt-8">
        <UiButton variant="secondary" :loading="pending" @click="loadMore">
          Загрузить ещё
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row-me {
  border-left: 3px solid theme('colors.gold.DEFAULT');
}

.row-me .player-nick {
  color: theme('colors.gold.DEFAULT');
}

.skel {
  background: rgb(var(--color-ivory) / 0.07);
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1;   }
}
</style>
