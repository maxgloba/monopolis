<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'game' })

const gameStore  = useGameStore()
const authStore  = useAuthStore()
const router     = useRouter()
const gameId     = Number(useRoute().params.id)
const { socket, connect, disconnect } = useGameSocket()
const { error: toastError } = useToast()

const phase       = ref<'roll' | 'action' | 'end'>('roll')
const myTurnFlash = ref(false)
const canBuy      = ref(false)
const rolling     = ref(false)
const currentDice = ref<[number, number] | null>(null)
const winner      = ref<{ userId: number | null; winnerNickname?: string | null } | null>(null)
const bankruptPlayer = ref<{ playerId: number; nickname: string } | null>(null)
const visualPositions    = ref<Record<number, number>>({})
const animatingPlayerId  = ref<number | null>(null)

// Карточка собственности
const propCardCell = ref<any | null>(null)
function openPropCard(cell: any) { propCardCell.value = cell }
function closePropCard()         { propCardCell.value = null }

// Квиз-вопрос
const activeQuestion = ref<{ questionId: number; text: string; options: string[]; reward: number; penalty: number } | null>(null)

// Долг перед другим игроком (монеты ушли в минус после ренты)
const debtAmount = ref<number | null>(null)

// Уведомление в заголовке вкладки
const BASE_TITLE        = 'Монополис'
const unreadCount       = ref(0)
let   titleFlashTimer: ReturnType<typeof setInterval> | null = null
let   titleFlashState   = false

function startTitleFlash(text: string) {
  if (titleFlashTimer) return
  titleFlashState = false
  titleFlashTimer = setInterval(() => {
    titleFlashState = !titleFlashState
    document.title = titleFlashState ? `💬 ${text}` : BASE_TITLE
  }, 1200)
}

function stopTitleFlash() {
  if (titleFlashTimer) { clearInterval(titleFlashTimer); titleFlashTimer = null }
  document.title = BASE_TITLE
  unreadCount.value = 0
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) stopTitleFlash()
  })
}

type ChatMsg =
  | { type: 'chat'; nickname: string; message: string; userId: number | null; time: string }
  | { type: 'system'; icon: string; text: string; time: string }
const chatMessages = ref<ChatMsg[]>([])

watch(() => gameStore.isMyTurn, (val) => {
  if (val) myTurnFlash.value = true
  else myTurnFlash.value = false
})

function pushSystem(icon: string, text: string) {
  const time = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  chatMessages.value.push({ type: 'system', icon, text, time })
  
}

const playerMenu = ref({ visible: false, nickname: '', userId: null as number | null, x: 0, y: 0 })

function openPlayerMenu({ nickname, userId, x, y }: { nickname: string; userId: number; x: number; y: number }) {
  if (userId === authStore.user?.id) return
  playerMenu.value = { visible: true, nickname, userId, x, y }
}
function onPanelPlayerClick({ player, idx, x, y }: any) {
  playerMenu.value = { visible: true, nickname: player.nickname, userId: player.userId, x, y }
}

function menuReply() {
  playerMenu.value.visible = false
}
function menuTrade() {
  // TODO: открыть интерфейс сделки
  playerMenu.value.visible = false
}
function menuProfile() {
  if (playerMenu.value.userId) router.push(`/profile/${playerMenu.value.userId}`)
  playerMenu.value.visible = false
}

onMounted(() => {
  connect()

  socket.on('game:state', (state: any) => {
    gameStore.updateState(state)
    const myUser = authStore.user
    if (myUser) {
      const me = state.players.find((p: any) => p.userId === myUser.id)
      if (me) {
        gameStore.myPlayerId = me.id
        // Реконнект: если я уже банкрот — показываем модалку
        if (me.isBankrupt) {
          bankruptPlayer.value = { playerId: me.id, nickname: me.nickname }
          debtAmount.value = null
        } else if (me.coins < 0) {
          // Реконнект с долгом — показываем панель долга
          debtAmount.value = -me.coins
        }
      }
      // Если игра завершена
      if (state.status === 'finished') {
        const winnerPlayer = state.players.find((p: any) => p.userId === state.winnerUserId)
        winner.value = { userId: state.winnerUserId, winnerNickname: winnerPlayer?.nickname ?? null }
      }
    }
    // Инициализируем визуальные позиции из state (только если ещё не заданы)
    state.players.forEach((p: any) => {
      if (visualPositions.value[p.id] === undefined) {
        visualPositions.value[p.id] = p.position
      }
    })
  })

  socket.on('game:state_update', (state: any) => {
    gameStore.updateState(state)
    // Синхронизируем visualPositions для всех игроков кроме анимирующегося
    state.players.forEach((p: any) => {
      if (p.id !== animatingPlayerId.value) {
        visualPositions.value[p.id] = p.position
      }
    })
  })

  // Очередь бросков — обрабатываем строго по одному, иначе сообщения боев приходят кучей
  let diceQueue = Promise.resolve()

  socket.on('game:dice_rolled', (data: any) => {
    diceQueue = diceQueue.then(() => processDiceRolled(data))
  })

  async function processDiceRolled(data: any) {
    const name = gameStore.gameState?.players.find((p: any) => p.id === data.playerId)?.nickname ?? 'Игрок'
    pushSystem('🎲', `${name}: ${data.dice[0]}+${data.dice[1]} → ${data.cellName}`)
    if (data.passedGo) pushSystem('⭐', `${name} прошёл СТАРТ +200`)

    const isMe = data.playerId === gameStore.myPlayerId
    animatingPlayerId.value = data.playerId

    // Сначала выставляем результат, потом запускаем анимацию —
    // иначе CSS-кубик стартует с неправильным финальным углом
    currentDice.value = data.dice
    rolling.value = true
    // Нужен один тик чтобы Vue применил currentDice до старта CSS-анимации
    await new Promise<void>(resolve => setTimeout(resolve, 16))

    await new Promise<void>(resolve => setTimeout(resolve, 2200))

    rolling.value = false

    const fromPos = visualPositions.value[data.playerId] ?? 0
    const steps = data.dice[0] + data.dice[1]
    for (let i = 1; i <= steps; i++) {
      await new Promise<void>(resolve => setTimeout(resolve, 320))
      visualPositions.value = { ...visualPositions.value, [data.playerId]: (fromPos + i) % 40 }
    }
    animatingPlayerId.value = null

    if (data.rentPaid) {
      const payer    = gameStore.gameState?.players.find((p: any) => p.id === data.playerId)?.nickname ?? 'Игрок'
      const owner    = gameStore.gameState?.players.find((p: any) => p.id === data.rentPaid.toPlayerId)?.nickname ?? 'Игрок'
      const cellName = gameStore.gameState?.board[data.newPos]?.name ?? data.cellName
      if (isMe) {
        pushSystem('💸', `Вы заплатили ренту ${owner} за ${cellName}: −${data.rentPaid.amount} монет`)
      } else if (data.rentPaid.toPlayerId === gameStore.myPlayerId) {
        pushSystem('💰', `${payer} заплатил вам ренту за ${cellName}: +${data.rentPaid.amount} монет`)
      } else {
        pushSystem('💸', `${payer} заплатил ренту ${owner} за ${cellName}: ${data.rentPaid.amount} монет`)
      }
    }

    if (!isMe) return

    if (data.cellType === 'chance') {
      // Ждём вопрос — endMyTurn вызовет game:question_result handler
      return
    }

    if (data.cellType === 'property' || data.cellType === 'railway' || data.cellType === 'utility') {
      const prop = gameStore.gameState?.properties[data.newPos]
      if (prop && prop.ownerId === null) {
        canBuy.value = true
        phase.value  = 'action'
        const cell = gameStore.gameState?.board[data.newPos]
        if (cell) propCardCell.value = cell
        return
      }
    }
    endMyTurn()
  }

  socket.on('game:property_bought', (data: any) => {
    const name = gameStore.gameState?.players.find((p: any) => p.id === data.playerId)?.nickname ?? 'Игрок'
    pushSystem('🏠', `${name} купил: ${data.message}`)
    if (data.playerId === gameStore.myPlayerId) {
      canBuy.value = false
      endMyTurn()
    }
  })

  socket.on('game:question', (data: any) => {
    activeQuestion.value = data
  })

  socket.on('game:question_result', (data: any) => {
    activeQuestion.value = null
    const name   = gameStore.gameState?.players.find((p: any) => p.id === data.playerId)?.nickname ?? 'Игрок'
    const isMe   = data.playerId === gameStore.myPlayerId
    const who    = isMe ? 'Вы' : (data.botName ?? name)
    const sign   = data.delta > 0 ? '+' : ''
    const icon   = data.correct ? '✅' : (data.timedOut ? '⏰' : '❌')
    const action = data.timedOut ? 'не ответил вовремя' : (data.correct ? 'правильно ответил' : 'ошибся')
    pushSystem(icon, `${who} ${action}: ${sign}${data.delta} монет`)
    if (isMe) endMyTurn()
  })

  socket.on('game:need_funds', (data: { debt: number }) => {
    debtAmount.value = data.debt
  })

  socket.on('game:debt_cleared', () => {
    debtAmount.value = null
  })

  socket.on('game:turn_changed', () => {
    phase.value  = 'roll'
    canBuy.value = false
    debtAmount.value = null
  })

  socket.on('game:finished', (data: any) => {
    winner.value = data
    debtAmount.value = null
  })

  socket.on('game:player_bankrupt', (data: any) => {
    bankruptPlayer.value = data
    debtAmount.value = null
    pushSystem('💸', `${data.nickname} обанкротился и выбывает из игры`)
  })

  socket.on('game:chat_history', (history: any[]) => {
    const applyHistory = () => {
      const gs = gameStore.gameState
      chatMessages.value = history.map(data => {
        if (data.type === 'system') {
          return { type: 'system' as const, icon: data.icon ?? '', text: data.text ?? '', time: new Date(data.timestamp).toLocaleTimeString('ru') }
        }
        const player = gs?.players.find((p: any) => p.userId != null && p.userId === data.userId)
        const name = player?.nickname ?? `Игрок#${data.userId}`
        return { type: 'chat' as const, nickname: name, message: data.message, userId: data.userId ?? null, time: new Date(data.timestamp).toLocaleTimeString('ru') }
      })
    }
    if (gameStore.gameState) {
      applyHistory()
    } else {
      const stop = watch(() => gameStore.gameState, (val) => { if (val) { applyHistory(); stop() } })
    }
  })

  socket.on('game:chat', (data: any) => {
    const player = gameStore.gameState?.players.find((p: any) => p.userId != null && p.userId === data.userId)
    const name = player?.nickname ?? `Игрок#${data.userId}`
    chatMessages.value.push({ type: 'chat', nickname: name, message: data.message, userId: data.userId ?? null, time: new Date(data.timestamp).toLocaleTimeString('ru') })
    
    // Уведомление в заголовке вкладки если она не в фокусе
    if (document.hidden && data.userId !== authStore.user?.id) {
      unreadCount.value++
      startTitleFlash(`${name}: ${data.message.slice(0, 30)}`)
    }
  })

  socket.on('game:error', (data: any) => {
    toastError(data.message)
  })

  // Все слушатели зарегистрированы — теперь можно джойниться
  socket.emit('game:join', gameId)
})

onUnmounted(() => { disconnect(); stopTitleFlash() })

const currentCell = computed(() => {
  const gs = gameStore.gameState
  const me = gs?.players.find(p => p.id === gameStore.myPlayerId)
  return me ? gs?.board[me.position] : undefined
})

const hasUnmortgagedProperty = computed(() => {
  const state = gameStore.gameState
  if (!state) return false
  return Object.values(state.properties).some(
    (p: any) => p.ownerId === gameStore.myPlayerId && !p.mortgaged
  )
})

function onRoll() {
  phase.value = 'rolling'
  gameStore.rollDice()
  // rolling запустится в processDiceRolled после получения результата с сервера
}
function endMyTurn() {
  if (debtAmount.value !== null) return  // нельзя закончить ход пока есть долг
  phase.value = 'end'
  gameStore.endTurn()
}

function surrender() {
  socket.emit('player:surrender')
}

function openMyPropertiesForMortgage() {
  const state = gameStore.gameState
  if (!state) return
  const myId = gameStore.myPlayerId
  const myProp = Object.values(state.properties).find(
    (p: any) => p.ownerId === myId && !p.mortgaged && !p.houses && !p.hotel
  ) as any | undefined
  if (myProp) {
    const cell = state.board[myProp.cellId]
    if (cell) openPropCard(cell)
  }
}
function sendAnswer(questionId: number, answerIdx: number) {
  socket.emit('player:answer_question', { gameId, questionId, answerIdx })
}
function onBuy()     { gameStore.buyProperty(); canBuy.value = false; closePropCard() }
function onDecline() { gameStore.declineBuy(); canBuy.value = false; closePropCard(); endMyTurn() }

function sendChat(text: string) {
  if (!text) return
  gameStore.sendChat(text)
}
</script>

<template>
  <div class="game-page">
    <div v-if="gameStore.gameState" class="game-layout-inner">
      <!-- Доска + все оверлеи только над ней -->
      <div class="game-board-area">
        <GameBoard
          :game-state="gameStore.gameState"
          :my-player-id="gameStore.myPlayerId"
          :visual-positions="visualPositions"
          :current-dice="currentDice"
          :rolling="rolling"
          @cell-click="openPropCard"
        />

        <!-- Конец игры — победитель -->
        <Transition name="turn-modal">
          <div v-if="winner" class="board-overlay">
            <div class="winner-card">
              <div class="winner-icon">🏆</div>
              <h2 class="winner-title">Игра окончена!</h2>
              <template v-if="winner.winnerNickname">
                <p class="winner-name">{{ winner.winnerNickname }}</p>
                <p class="winner-sub">
                  {{ winner.userId === authStore.user?.id ? 'Вы победили! Поздравляем!' : 'побеждает в этой партии' }}
                </p>
              </template>
              <p v-else class="winner-sub">Победитель определён</p>
              <div class="winner-actions">
                <UiButton :full="true" @click="router.push(`/room/${gameId}`)">Вернуться в комнату</UiButton>
                <UiButton variant="ghost" :full="true" @click="router.push('/')">В лобби</UiButton>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Банкрот -->
        <Transition name="turn-modal">
          <div v-if="bankruptPlayer && !winner" class="board-overlay">
            <div class="bankrupt-card">
              <div class="bankrupt-icon">💸</div>
              <h2 class="bankrupt-title">
                {{ bankruptPlayer.playerId === gameStore.myPlayerId ? 'ВЫ ВЫБЫЛИ' : 'ИГРОК ВЫБЫЛ' }}
              </h2>
              <p class="bankrupt-name">{{ bankruptPlayer.nickname }}</p>
              <p class="bankrupt-sub">
                {{ bankruptPlayer.playerId === gameStore.myPlayerId
                  ? 'Ваших активов не хватило для погашения долга.'
                  : 'Активов не хватило для погашения долга.' }}
              </p>
              <UiButton v-if="bankruptPlayer.playerId === gameStore.myPlayerId" :full="true" @click="router.push(`/room/${gameId}`)">Вернуться в комнату</UiButton>
              <UiButton v-else variant="ghost" :full="true" @click="bankruptPlayer = null">Закрыть</UiButton>
            </div>
          </div>
        </Transition>

        <!-- Модалка хода -->
        <Transition name="turn-modal">
          <div v-if="gameStore.isMyTurn && phase === 'roll'" class="board-overlay board-overlay--dim" @click.self="() => {}">
            <div class="turn-modal" :class="{ 'my-turn-flash': myTurnFlash }">
              <div class="turn-modal-title">ВАШ ХОД</div>
              <div class="turn-modal-actions">
                <UiButton size="lg" :full="true" @mouseenter="myTurnFlash = false" @click="onRoll">🎲 Бросить кубики</UiButton>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Панель долга -->
        <Transition name="turn-modal">
          <div v-if="debtAmount !== null && gameStore.isMyTurn" class="board-overlay">
            <div class="debt-panel">
              <div class="debt-icon">⚠️</div>
              <div class="debt-title">ЗАДОЛЖЕННОСТЬ</div>
              <div class="debt-amount">{{ debtAmount }} монет</div>
              <p class="debt-hint">У вас недостаточно средств для оплаты ренты.<br>Заложите имущество, чтобы погасить долг.</p>
              <UiButton v-if="hasUnmortgagedProperty" :full="true" @click="openMyPropertiesForMortgage">🏟️ Выбрать имущество для залога</UiButton>
              <template v-else>
                <p class="debt-hint debt-hint--danger">Нечего закладывать — вы не можете погасить долг.</p>
                <UiButton variant="ghost" :full="true" @click="surrender">🏳️ Сдаться и выйти из игры</UiButton>
              </template>
            </div>
          </div>
        </Transition>

        <!-- Квиз-вопрос -->
        <Transition name="turn-modal">
          <div v-if="activeQuestion" class="board-overlay">
            <GameQuestionCard
              :question="activeQuestion"
              @answer="sendAnswer"
            />
          </div>
        </Transition>

        <!-- Карточка собственности -->
        <Transition name="turn-modal">
          <div v-if="propCardCell" class="board-overlay" @click.self="closePropCard">
            <GamePropertyCard
              :cell="propCardCell"
              :property="gameStore.gameState?.properties[propCardCell.id] ?? null"
              :players="gameStore.gameState?.players"
              :my-player-id="gameStore.myPlayerId"
              :my-coins="gameStore.gameState?.players.find(p => p.id === gameStore.myPlayerId)?.coins"
              :can-buy="phase === 'action' && canBuy && propCardCell.id === currentCell?.id"
              @buy="onBuy(); closePropCard()"
              @decline="onDecline(); closePropCard()"
              @close="closePropCard"
              @trade="(id) => { closePropCard(); playerMenu.value = { visible: true, nickname: gameStore.gameState?.players.find(p=>p.id===id)?.nickname ?? '', userId: gameStore.gameState?.players.find(p=>p.id===id)?.userId ?? null, x: 0, y: 0 } }"
              @build-house="(cellId) => { gameStore.buildHouse(cellId); closePropCard() }"
              @mortgage="(cellId) => { gameStore.mortgage(cellId); closePropCard() }"
            />
          </div>
        </Transition>
      </div>

      <!-- Сайдбар 300px -->
      <div class="game-sidebar">
        <!-- Игроки -->
        <div class="sidebar-section">
          <div class="sidebar-title">ИГРОКИ</div>
          <GamePlayerPanel
            :players="gameStore.gameState.players"
            :current-player-idx="gameStore.gameState.currentPlayerIdx"
            :my-player-id="gameStore.myPlayerId"
            @player-click="onPanelPlayerClick"
          />
        </div>

        <!-- Чат — всегда виден ниже -->
        <div class="sidebar-section sidebar-chat">
          <div class="sidebar-title">ЧАТ</div>
          <AppSidebarChat
            :messages="chatMessages"
            :my-user-id="authStore.user?.id"
            empty-text="Игра началась 🎮"
            @send="sendChat"
            @avatar-click="openPlayerMenu"
          />
        </div>
      </div>
    </div>

    <div v-else class="game-loading">
      <div class="loading-spinner"></div>
      <p>Загрузка игры...</p>
    </div>

    <!-- Контекстное меню игрока -->
    <Teleport to="body">
      <div v-if="playerMenu.visible" class="player-menu" :style="{ top: playerMenu.y + 'px', left: playerMenu.x + 'px' }">
        <div class="player-menu-name">{{ playerMenu.nickname }}</div>
        <button class="player-menu-item" @click="menuReply">💬 Ответить в чате</button>
        <button class="player-menu-item" @click="menuTrade">🤝 Предложить сделку</button>
        <button class="player-menu-item" @click="menuProfile">👤 Профиль</button>
      </div>
      <div v-if="playerMenu.visible" class="player-menu-overlay" @click="playerMenu.visible = false" />
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.game-page {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.winner-card {
  position: relative;
  background: $noir-card;
  border: 1px solid $gold;
  border-radius: $radius-card;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, $gold, transparent); }
}

.winner-icon    { font-size: 56px; }
.winner-title   { font-family: $font-serif; font-size: 24px; color: $gold; letter-spacing: 3px; margin: 0; }
.winner-name    { font-size: 28px; color: $ivory; font-family: $font-serif; font-weight: 700; margin: 0; }
.winner-sub     { color: $ivory-muted; font-size: 14px; margin: 0; }
.winner-actions { display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 8px; }

/* ─── Банкрот ─── */
.bankrupt-card {
  width: 360px;
  background: $noir-card;
  border: 1px solid $theme-politics;
  border-radius: $radius-card;
  padding: 36px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 0 60px rgba($theme-politics, 0.35), 0 8px 48px rgba(0,0,0,0.9);
}

.bankrupt-icon  { font-size: 48px; }
.bankrupt-title { font-family: $font-serif; font-size: 22px; color: $theme-politics; letter-spacing: 3px; margin: 0; }
.bankrupt-name  { font-size: 20px; color: $ivory; font-weight: 700; margin: 0; }
.bankrupt-sub   { font-size: 13px; color: $ivory-muted; text-align: center; line-height: 1.5; margin: 0; }

.game-layout-inner {
  display: grid;
  grid-template-columns: 1fr 300px;
  flex: 1;
  min-height: 0;
  gap: 0;
  box-sizing: border-box;
}

.game-board-area {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  position: relative;
}

.roll-banner {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: $noir-card;
  border: 1px solid $noir-border;
  border-radius: $radius-card;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
  z-index: 50;
  pointer-events: none;
}

.roll-banner-name {
  font-size: 10px;
  letter-spacing: 2px;
  color: $gold;
  text-transform: uppercase;
}

.roll-banner-enter-active, .roll-banner-leave-active { transition: opacity 0.2s, transform 0.2s; }
.roll-banner-enter-from, .roll-banner-leave-to { opacity: 0; transform: translateX(-50%) translateY(-8px); }

/* ─── Сайдбар ─── */
.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  border-left: 1px solid $noir-border;
  background: #0d0d0b;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid $noir-border;
  flex-shrink: 0;

  &.sidebar-dice-view {
    flex-shrink: 0;
  }

  &.sidebar-chat {
    flex: 1;
    min-height: 120px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }
}

.sidebar-title {
  font-family: $font-serif;
  font-size: 10px;
  color: $gold;
  letter-spacing: 3px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 2px;
  min-height: 0;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: $noir-border; border-radius: 2px; }
}

.chat-empty {
  color: $ivory-faint;
  font-size: 12px;
  text-align: center;
  padding-top: 16px;
}

/* ─── Системное событие ─── */
.chat-system {
  display: flex;
  align-items: center;
  gap: 5px;
  align-self: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 4px 10px;
  max-width: 92%;
}

.chat-system-icon { font-size: 12px; flex-shrink: 0; }
.chat-system-text { font-size: 11px; color: $ivory-muted; flex: 1; line-height: 1.4; }
.chat-system-time { font-size: 9px; color: $ivory-faint; flex-shrink: 0; }

/* ─── Строка сообщения ─── */
.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;

  &.chat-row-mine {
    flex-direction: row-reverse;
  }
}

/* Аватар */
.chat-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: $gold-muted;
  border: none;
  color: $noir;
  font-size: 11px;
  font-weight: 700;
  font-family: $font-sans;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: $gold; }
}

/* ─── Пузыри ─── */
.chat-bubble {
  max-width: 78%;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &-other {
    background: #1e2a1e;
    border: 1px solid rgba($gold, 0.12);
    border-radius: 2px 12px 12px 12px;
    padding: 7px 10px 5px;
  }

  &-mine {
    background: #1a2d3a;
    border: 1px solid rgba(#2196F3, 0.25);
    border-radius: 12px 2px 12px 12px;
    padding: 7px 10px 5px;
    align-items: flex-end;
  }
}

.chat-bubble-name {
  font-size: 10px;
  color: $gold;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.chat-bubble-text {
  font-size: 13px;
  color: $ivory;
  line-height: 1.4;
  word-break: break-word;
}

.chat-bubble-time {
  font-size: 9px;
  color: $ivory-faint;
  align-self: flex-end;
  margin-top: 2px;
}

/* ─── Ввод сообщения ─── */
.chat-input-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.chat-reply-tag {
  background: rgba($gold, 0.1);
  border: 1px solid rgba($gold, 0.3);
  border-radius: $radius-sharp;
  color: $gold;
  font-size: 11px;
  font-family: $font-sans;
  padding: 3px 8px;
  cursor: pointer;
  text-align: left;
  &:hover { background: rgba($gold, 0.18); }
}

.chat-input-send {
  display: flex;
  gap: 6px;
  align-items: center;
}

.chat-input {
  flex: 1;
  background: #1a1a16;
  border: 1px solid $noir-border;
  border-radius: 20px;
  color: $ivory;
  font-family: $font-sans;
  font-size: 13px;
  padding: 8px 14px;
  outline: none;
  transition: border-color $transition-fast;
  &:focus { border-color: rgba($gold, 0.4); }
  &::placeholder { color: $ivory-faint; }
}

.chat-send {
  width: 34px;
  height: 34px;
  background: $gold;
  color: $noir;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
  transition: background $transition-fast, transform $transition-fast;
  &:hover { background: $gold-light; transform: scale(1.08); }
}

.game-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: $ivory-muted;
  font-size: 14px;
}

.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid $noir-border;
  border-top-color: $gold;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }


/* ─── Единый оверлей над доской ─── */
.board-overlay {
  position: absolute;
  inset: 0;
  z-index: 210;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(3px);

  &--dim { background: rgba(0,0,0,0.35); }
}

.turn-modal {
  pointer-events: all;
  background: $noir-card;
  border: 1px solid $noir-border;
  border-radius: $radius-card;
  padding: 24px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.7);

  &.my-turn-flash {
    animation: myTurnFlash 2s ease-in-out infinite;
  }
}

.turn-modal-title {
  font-family: $font-serif;
  font-size: 11px;
  letter-spacing: 3px;
  color: $gold;
  text-align: center;
}

.turn-modal-dice {
  display: flex;
  justify-content: center;
}

.turn-modal-property {
  background: $noir;
  border: 1px solid $noir-border;
  border-radius: $radius-card;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.turn-modal-property-header {
  padding: 12px 14px 10px;
  border-left: 4px solid var(--cell-color, #888);
  background: rgba(255,255,255,0.03);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.turn-modal-property-color-bar {
  height: 3px;
  background: var(--cell-color, #888);
  border-radius: 2px;
  margin-bottom: 6px;
}

.turn-modal-property-name  {
  font-family: $font-serif;
  font-size: 15px;
  color: $ivory;
}

.turn-modal-property-price {
  font-size: 12px;
  color: $ivory-muted;
  strong { color: $gold; }
}

.turn-modal-rent-table {
  padding: 8px 0 4px;
  display: flex;
  flex-direction: column;
}

.rent-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 14px;
  font-size: 11px;
  color: $ivory-muted;
  border-bottom: 1px solid rgba(255,255,255,0.04);

  span:last-child {
    font-variant-numeric: tabular-nums;
    color: $ivory;
    font-weight: 500;
  }

  &.rent-row-dim {
    opacity: 0.6;
    font-style: italic;
  }

  &.rent-row-hotel {
    color: $gold;
    span:last-child { color: $gold; }
  }
}

.turn-modal-rent-note {
  font-size: 10px;
  color: $ivory-faint;
  padding: 8px 14px;
  line-height: 1.5;
}

.turn-modal-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Анимация появления модалки */
.turn-modal-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.turn-modal-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.turn-modal-enter-from   { opacity: 0; transform: scale(0.92); }
.turn-modal-leave-to     { opacity: 0; transform: scale(0.92); }

/* ─── Панель долга ─── */
.debt-panel {
  width: 340px;
  background: $noir-card;
  border: 1px solid $theme-politics;
  border-radius: $radius-card;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 0 40px rgba($theme-politics, 0.3), 0 8px 48px rgba(0,0,0,0.8);
  animation: debtPulse 2s ease-in-out infinite;
}

@keyframes debtPulse {
  0%   { box-shadow: 0 0 20px rgba($theme-politics, 0.2), 0 8px 48px rgba(0,0,0,0.8); }
  50%  { box-shadow: 0 0 50px rgba($theme-politics, 0.5), 0 8px 48px rgba(0,0,0,0.8); }
  100% { box-shadow: 0 0 20px rgba($theme-politics, 0.2), 0 8px 48px rgba(0,0,0,0.8); }
}

.debt-icon   { font-size: 36px; }
.debt-title  { font-size: 11px; letter-spacing: 3px; color: $theme-politics; font-weight: 700; }
.debt-amount { font-size: 32px; font-family: $font-serif; color: $theme-politics; font-weight: 700; }
.debt-hint {
  font-size: 13px;
  color: $ivory-muted;
  text-align: center;
  line-height: 1.5;
  margin: 0;
  &--danger { color: $theme-politics; }
}

/* ─── Мой ход — повторяющееся мигание ─── */
@keyframes myTurnFlash {
  0%   { box-shadow: 0 8px 48px rgba(0,0,0,0.7), 0 0  8px rgba($gold, 0.0),  0 0  0px rgba($gold, 0.0);  border-color: rgba($gold, 0.3); }
  50%  { box-shadow: 0 8px 48px rgba(0,0,0,0.7), 0 0 32px rgba($gold, 0.55), 0 0 64px rgba($gold, 0.2);  border-color: $gold; }
  100% { box-shadow: 0 8px 48px rgba(0,0,0,0.7), 0 0  8px rgba($gold, 0.0),  0 0  0px rgba($gold, 0.0);  border-color: rgba($gold, 0.3); }
}

.dice-area {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.buy-hint {
  background: rgba($gold, 0.08);
  border: 1px solid rgba($gold, 0.2);
  border-radius: $radius-card;
  padding: 10px 12px;
  text-align: center;
}
.buy-cell-name  { font-size: 13px; color: $ivory; }
.buy-cell-price { font-size: 11px; color: $gold; margin-top: 2px; }

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ─── Чат reply ─── */
.chat-reply-clear {
  width: 24px;
  height: 24px;
  background: none;
  border: 1px solid $noir-border;
  border-radius: $radius-sharp;
  color: $ivory-faint;
  cursor: pointer;
  font-size: 11px;
  flex-shrink: 0;
  &:hover { color: $ivory; border-color: $ivory-muted; }
}

/* ─── Контекстное меню игрока ─── */
.player-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.player-menu {
  position: fixed;
  z-index: 1000;
  background: $noir-card;
  border: 1px solid $gold;
  border-radius: $radius-card;
  padding: 4px;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.7);
}

.player-menu-name {
  font-size: 10px;
  color: $gold;
  letter-spacing: 2px;
  padding: 6px 10px 4px;
  border-bottom: 1px solid $noir-border;
  margin-bottom: 4px;
}

.player-menu-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: $ivory-muted;
  font-family: $font-sans;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: $radius-sharp;
  cursor: pointer;
  &:hover { background: rgba($gold, 0.1); color: $ivory; }
}
</style>
