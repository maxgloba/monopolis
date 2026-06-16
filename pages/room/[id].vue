<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'default' })

const router    = useRouter()
const roomId    = Number(useRoute().params.id)
const authStore = useAuthStore()
const roomStore = useRoomStore()
const { error: toastError } = useToast()
const { socket, connect, disconnect } = useLobbySocket()

interface Player {
  userId: number | null
  nickname: string
  avatarUrl: string | null
  pieceId: string | null
  isReady: boolean
  isBot: boolean
}

const players      = ref<Player[]>([])
const myPiece      = ref<string | null>(null)
const isReady      = ref(false)
const chatMessages    = ref<{ type?: 'system' | 'user'; userId?: number; nickname?: string; message?: string; text?: string; icon?: string; time: string }[]>([])
const chatRef         = ref<HTMLElement | null>(null)
const chatInput       = ref('')
const countdown    = ref<number | null>(null)
const addingBot    = ref(false)
const startingGame = ref(false)

const room       = computed(() => roomStore.currentRoom)
const maxPlayers = computed(() => room.value?.maxPlayers ?? 4)
const isHost     = computed(() => room.value?.hostUserId === authStore.user?.id)
const isInGame   = computed(() => room.value?.status === 'in_game')
const canAddBot  = computed(() => isHost.value && players.value.length < maxPlayers.value)

onMounted(async () => {
  await roomStore.fetchRoom(roomId)

  // Если игра уже идёт — подгружаем игроков из неё
  if (isInGame.value) {
    try {
      const res = await $fetch<any>(`/api/rooms/${roomId}/active-game`)
      if (res?.data?.players?.length) {
        players.value = res.data.players.map((p: any) => ({
          userId: p.userId ?? null,
          nickname: p.nickname ?? `Игрок ${p.userId}`,
          avatarUrl: null,
          pieceId: null,
          isReady: true,
          isBot: !!p.isBot,
        }))
      }
    } catch {}
  }

  connect()
  // Загружаем историю игрового чата — добавляем как системный разделитель + обычные сообщения
  try {
    const res = await $fetch<any>(`/api/rooms/${roomId}/game-chat`)
    if (res?.data?.messages?.length) {
      for (const m of res.data.messages) {
        if (m.type === 'system') {
          chatMessages.value.push({ type: 'system', icon: m.icon ?? '', text: m.text ?? '', time: new Date(m.timestamp).toLocaleTimeString('ru') })
        } else {
          chatMessages.value.push({
            type: 'user',
            userId: m.userId,
            nickname: m.nickname ?? `Игрок ${m.userId}`,
            message: m.message,
            time: new Date(m.timestamp).toLocaleTimeString('ru'),
          })
        }
      }
    }
  } catch {}

  // Все слушатели регистрируем ДО отправки room:join
  // (иначе room:sync придёт раньше чем мы подпишемся)

  // Полный снимок состояния комнаты при (пере)входе
  socket.on('room:sync', (data: { members: any[]; bots: any[] }) => {
    // Если игра уже идёт — игроки загружены из БД, не перезаписываем пустым списком
    if (!isInGame.value) {
      players.value = [
        ...data.members.map((m: any) => ({
          userId: m.userId, nickname: m.nickname, avatarUrl: null,
          pieceId: m.pieceId ?? null, isReady: m.isReady ?? false, isBot: false,
        })),
        ...data.bots.map((b: any) => ({
          userId: null, nickname: b.nickname, avatarUrl: null,
          pieceId: b.pieceId ?? null, isReady: true, isBot: true,
        })),
      ]
    }
    // Восстанавливаем выбранную фишку и готовность текущего игрока
    const me = data.members.find((m: any) => m.userId === authStore.user?.id)
    if (me?.pieceId) myPiece.value = me.pieceId
    if (me?.isReady) isReady.value = me.isReady
  })

  socket.on('room:player_joined', (data: any) => {
    if (!players.value.find(p => p.userId === data.userId)) {
      players.value.push({ userId: data.userId, nickname: data.nickname ?? `Игрок ${data.userId}`, avatarUrl: null, pieceId: null, isReady: false, isBot: false })
    }
  })

  socket.on('room:player_left', (data: any) => {
    players.value = players.value.filter(p => p.userId !== data.userId)
  })

  socket.on('room:player_ready', (data: any) => {
    const p = players.value.find(p => p.userId === data.userId)
    if (p) p.isReady = data.isReady
  })

  socket.on('room:piece_selected', (data: any) => {
    const p = players.value.find(p => p.userId === data.userId)
    if (p) p.pieceId = data.pieceId
  })

  socket.on('room:bot_added', (data: any) => {
    players.value.push({ userId: null, nickname: data.nickname ?? 'Бот', avatarUrl: null, pieceId: null, isReady: true, isBot: true })
  })

  socket.on('room:chat', (data: any) => {
    const sender = players.value.find(p => p.userId === data.userId)
    chatMessages.value.push({
      type: 'user',
      userId: data.userId,
      nickname: data.nickname ?? sender?.nickname ?? `Игрок ${data.userId}`,
      message: data.message,
      time: new Date(data.timestamp).toLocaleTimeString('ru'),
    })
  })

  socket.on('room:game_starting', (data: { gameId: number; countdownMs: number }) => {
    countdown.value = Math.ceil(data.countdownMs / 1000)
    const interval = setInterval(() => {
      if (countdown.value! > 0) countdown.value!--
      else { clearInterval(interval); router.push(`/game/${data.gameId}`) }
    }, 1000)
  })

  // Отправляем room:join только после регистрации всех слушателей
  socket.emit('room:join', roomId)
})

onUnmounted(() => {
  socket.emit('room:leave')
  disconnect()
})

async function toggleReady() {
  isReady.value = !isReady.value
  socket.emit('room:ready', isReady.value)
}

async function selectPiece(pieceId: string) {
  myPiece.value = pieceId
  socket.emit('room:select_piece', pieceId)
  try { await roomStore.selectPiece(roomId, pieceId) } catch {}
}

function sendChat(text: string) {
  socket.emit('room:chat', text)
}

async function addBot() {
  addingBot.value = true
  try {
    await roomStore.addBot(roomId)
    socket.emit('room:add_bot')
  } catch (e: any) {
    toastError(e.message)
  } finally {
    addingBot.value = false
  }
}

async function startGame() {
  startingGame.value = true
  try {
    await roomStore.startGame(roomId)
    socket.emit('room:start_game')
  } catch (e: any) {
    if (e.message?.includes('уже началась') || e.code === 'ROOM_ALREADY_STARTED') {
      await redirectToActiveGame()
    } else {
      toastError(e.message)
    }
  } finally {
    startingGame.value = false
  }
}

async function redirectToActiveGame() {
  try {
    const res = await $fetch<any>(`/api/rooms/${roomId}/active-game`)
    if (res?.data?.gameId) {
      router.push(`/game/${res.data.gameId}`)
    }
  } catch {
    toastError('Игра уже началась — обновите страницу')
  }
}

const PLAYER_COLORS = ['#D4A017', '#4CAF50', '#2196F3', '#E91E63']

const takenPieces = computed(() =>
  players.value.filter(p => p.userId !== authStore.user?.id && p.pieceId).map(p => p.pieceId!)
)

const anyoneReady = computed(() =>
  players.value.some(p => p.isReady || p.isBot)
)
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 bg-noir text-ivory overflow-hidden">

    <!-- Countdown overlay -->
    <div
      v-if="countdown !== null"
      class="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 font-serif text-gold text-lg tracking-[3px] bg-noir/90"
    >
      <p>Игра начинается через</p>
      <div class="text-[80px]">{{ countdown }}</div>
    </div>

    <!-- Main content -->
    <div class="room-layout flex-1 min-h-0 overflow-hidden grid" style="grid-template-columns: 1fr 300px;">

        <!-- Left: piece selector + start game -->
        <div class="flex flex-col gap-8 p-10 px-12 overflow-y-auto min-h-0">
          <div class="flex flex-col gap-4">
            <h2 class="text-ivory font-serif">Выбор фишки</h2>
            <LobbyPieceSelector
              :theme="room?.theme ?? 'football'"
              :taken-pieces="takenPieces"
              :selected-piece="myPiece"
              @select="selectPiece"
            />
          </div>

          <div
            class="flex flex-col gap-3"
            :class="{ 'grid grid-cols-2 gap-3': isHost && !isInGame }"
          >
            <UiButton
              v-if="!isInGame"
              :variant="isReady ? 'secondary' : 'ghost'"
              size="lg"
              :full="true"
              @click="toggleReady"
            >
              {{ isReady ? '✓ Готов' : 'Готов к игре' }}
            </UiButton>

            <UiButton
              v-if="isInGame"
              variant="primary"
              size="lg"
              :full="true"
              @click="redirectToActiveGame"
            >
              Войти в игру
            </UiButton>

            <UiButton
              v-if="isHost && !isInGame"
              variant="primary"
              size="lg"
              :full="true"
              :loading="startingGame"
              :disabled="!anyoneReady"
              @click="startGame"
            >
              Начать игру
            </UiButton>
          </div>
        </div>

        <!-- Right sidebar: players + chat -->
        <div class="w-[300px] border-l border-noir-border bg-[#0d0d0b] flex flex-col overflow-hidden">
          <!-- Игроки + кнопки действий -->
          <div class="flex flex-col gap-2 p-3 border-b border-noir-border flex-shrink-0">
            <div class="font-serif text-[10px] text-gold tracking-[3px] uppercase flex-shrink-0">ИГРОКИ</div>
            <div class="flex flex-col gap-2">
              <div
                v-for="(player, i) in players"
                :key="i"
                class="player-panel flex items-center gap-2 pr-3 bg-noir-card border border-noir-border rounded-card overflow-hidden relative transition-all duration-[150ms] min-h-[52px] cursor-default"
                :class="{
                  'cursor-pointer is-me': player.userId === authStore.user?.id,
                  'is-ready': player.isReady || player.isBot
                }"
                :style="{ '--pc': PLAYER_COLORS[i % 4] }"
                @click="player.userId === authStore.user?.id && toggleReady()"
              >
                <div class="w-1 self-stretch flex-shrink-0" style="background: var(--pc)" />
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                  style="background: var(--pc); color: rgba(0,0,0,0.85)"
                >
                  {{ (player.nickname ?? '?').slice(0, 1).toUpperCase() }}
                </div>
                <div class="flex flex-col gap-0.5 flex-1 min-w-0 py-1">
                  <span class="text-[12px] text-ivory tracking-[0.5px] whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-[5px]">
                    {{ player.nickname }}
                    <span v-if="player.userId === authStore.user?.id" class="text-[10px]" style="color: var(--pc)">(вы)</span>
                    <span v-if="player.isBot" class="text-[8px] tracking-[1px] text-ivory-faint border border-noir-border px-[3px] py-[1px]">БОТ</span>
                  </span>
                </div>
                <div class="absolute top-[6px] right-2">
                  <div
                    class="ready-badge text-[8px] tracking-[2px] border rounded-imperial px-[5px] py-[2px] font-sans font-medium uppercase"
                    :class="{ ready: player.isReady || player.isBot, 'text-ivory-faint border-noir-border': !(player.isReady || player.isBot) }"
                    :style="(player.isReady || player.isBot) ? { color: 'var(--pc)', borderColor: 'color-mix(in srgb, var(--pc) 60%, transparent)' } : {}"
                  >
                    {{ player.isReady || player.isBot ? 'ГОТОВ' : 'ОЖИДАНИЕ' }}
                  </div>
                </div>
              </div>

              <!-- Пустые слоты -->
              <div
                v-for="j in (maxPlayers - players.length)"
                :key="'empty-' + j"
                class="flex items-center gap-2 pr-3 bg-noir-card border border-noir-border rounded-card overflow-hidden relative min-h-[52px] opacity-35 cursor-default"
              >
                <div class="w-1 self-stretch flex-shrink-0 bg-noir-border" />
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 bg-noir-border text-ivory-faint">
                  {{ players.length + j }}
                </div>
                <div class="flex flex-col gap-0.5 flex-1 min-w-0 py-1">
                  <span class="text-[11px] text-ivory-faint">Свободно</span>
                </div>
              </div>
            </div>

            <!-- Кнопки действий под игроками -->
            <div v-if="canAddBot" class="flex flex-col gap-2 mt-3">
              <UiButton variant="ghost" :full="true" :loading="addingBot" @click="addBot">
                + Добавить бота
              </UiButton>
            </div>
          </div>

          <!-- Чат -->
          <div class="flex flex-col gap-2 p-3 flex-1 min-h-[120px] overflow-hidden">
            <div class="font-serif text-[10px] text-gold tracking-[3px] uppercase flex-shrink-0">ЧАТ</div>
            <AppSidebarChat
              :messages="chatMessages"
              :my-user-id="authStore.user?.id"
              @send="sendChat"
            />
          </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
.is-me:hover {
  border-color: color-mix(in srgb, var(--pc) 60%, transparent);
}

.is-ready {
  border-color: color-mix(in srgb, var(--pc) 40%, transparent) !important;
  box-shadow: 0 0 8px color-mix(in srgb, var(--pc) 20%, transparent);
}

.ready-badge.ready {
  animation: readyBlink 2s ease-in-out infinite;
}

@keyframes readyBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
</style>
