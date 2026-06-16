<script setup lang="ts">
const roomStore = useRoomStore()
const authStore = useAuthStore()
const router    = useRouter()
const { error: toastError } = useToast()

const activeTheme   = ref<string>('all')
const activeType    = ref<string>('all')
const showCreate    = ref(false)
const activeGameId  = ref<number | null>(null)

const themes = [
  { value: 'all',      label: 'Все' },
  { value: 'football', label: '⚽ Футбол' },
  { value: 'hockey',   label: '🏒 Хоккей' },
  { value: 'empire',   label: '👑 Империя' },
  { value: 'politics', label: '🏛️ Политика' },
]

onMounted(async () => {
  const route = useRoute()
  if (route.query.vk_login && !authStore.isAuthenticated) {
    await authStore.refreshToken()
  }
  if (authStore.isAuthenticated) {
    activeGameId.value = await roomStore.fetchActiveGame()
  }
  loadRooms()
})

onActivated(() => { loadRooms() })

async function loadRooms() {
  await roomStore.fetchRooms({
    theme:     activeTheme.value !== 'all' ? activeTheme.value : undefined,
    game_type: activeType.value !== 'all'  ? activeType.value  : undefined,
  })
}

async function onJoin(id: number) {
  if (!authStore.isAuthenticated) { router.push('/login'); return }
  try {
    await roomStore.joinRoom(id)
    router.push(`/room/${id}`)
  } catch (e: any) {
    toastError(e.message)
    await loadRooms()
  }
}

async function onDelete(id: number) {
  if (!confirm('Удалить комнату?')) return
  try {
    await roomStore.deleteRoom(id)
  } catch (e: any) {
    toastError(e.message)
  }
}

const isAdmin = computed(() => {
  const role = authStore.user?.role
  return role === 'super_admin' || role === 'support'
})

const deletableRoomIds = computed<Set<number>>(() => {
  const myId = authStore.user?.id
  if (!myId) return new Set()
  return new Set(
    roomStore.rooms
      .filter(r => isAdmin.value || Number(r.hostUserId) === Number(myId))
      .map(r => r.id)
  )
})

watch([activeTheme, activeType], loadRooms)
</script>

<template>
  <div class="min-h-screen bg-noir text-ivory">
    <main class="max-w-[1280px] mx-auto px-10 py-8">
      <div v-if="activeGameId" class="flex items-center gap-[14px] mb-6 px-5 py-4 bg-gold/[0.08] border border-gold/40 rounded-imperial">
        <span class="text-[22px] shrink-0">🎮</span>
        <span class="flex-1 text-[13px] tracking-[0.5px] text-ivory">У вас есть незавершённая игра</span>
        <UiButton @click="router.push(`/game/${activeGameId}`)">Вернуться в игру</UiButton>
      </div>

      <div class="flex items-center gap-4 flex-wrap mb-7">
        <div class="flex gap-[6px]">
          <button
            v-for="t in themes" :key="t.value"
            class="px-4 py-2 bg-transparent border border-noir-border rounded-imperial text-ivory-muted text-[11px] tracking-[1px] cursor-pointer transition-all duration-[150ms]"
            :class="{ 'border-gold text-gold bg-gold/[0.05]': activeTheme === t.value, 'hover:border-gold hover:text-gold hover:bg-gold/[0.05]': activeTheme !== t.value }"
            @click="activeTheme = t.value"
          >{{ t.label }}</button>
        </div>
        <div class="flex gap-[6px]">
          <button class="px-4 py-2 bg-transparent border border-noir-border rounded-imperial text-ivory-muted text-[11px] tracking-[1px] cursor-pointer transition-all duration-[150ms]" :class="{ 'border-gold text-gold bg-gold/[0.05]': activeType === 'all', 'hover:border-gold hover:text-gold hover:bg-gold/[0.05]': activeType !== 'all' }" @click="activeType = 'all'">Все</button>
          <button class="px-4 py-2 bg-transparent border border-noir-border rounded-imperial text-ivory-muted text-[11px] tracking-[1px] cursor-pointer transition-all duration-[150ms]" :class="{ 'border-gold text-gold bg-gold/[0.05]': activeType === 'virtual', 'hover:border-gold hover:text-gold hover:bg-gold/[0.05]': activeType !== 'virtual' }" @click="activeType = 'virtual'">🪙 Монеты</button>
          <button class="px-4 py-2 bg-transparent border border-noir-border rounded-imperial text-ivory-muted text-[11px] tracking-[1px] cursor-pointer transition-all duration-[150ms]" :class="{ 'border-gold text-gold bg-gold/[0.05]': activeType === 'real_money', 'hover:border-gold hover:text-gold hover:bg-gold/[0.05]': activeType !== 'real_money' }" @click="activeType = 'real_money'">💳 Real Money</button>
        </div>
        <UiButton @click="authStore.isAuthenticated ? showCreate = true : router.push('/login')">
          + Создать комнату
        </UiButton>
      </div>

      <div v-if="roomStore.rooms.length" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 items-stretch">
        <LobbyRoomCard
          v-for="room in roomStore.rooms"
          :key="room.id"
          :room="room"
          :can-delete="deletableRoomIds.has(room.id)"
          @join="onJoin"
          @rejoin="id => router.push(`/game/${id}`)"
          @join-room="id => router.push(`/room/${id}`)"
          @delete="onDelete"
        />
      </div>
      <div v-else class="text-center py-[80px] px-5 text-ivory-faint text-[14px] tracking-[1px]">
        <p>Нет активных комнат. Создайте первую!</p>
      </div>
    </main>

    <LobbyCreateRoom v-if="showCreate" @close="showCreate = false" @created="showCreate = false" />
  </div>
</template>
