import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'

interface Cell {
  id: number; type: string; name: string
  price?: number; rent?: number[]; group?: number; color?: string; bonus?: number; amount?: number
}

interface PropertyState {
  cellId: number; ownerId: number | null; houses: number; hotel: boolean; mortgaged: boolean
}

interface PlayerState {
  id: number; userId: number | null; isBot: boolean; pieceId: string
  position: number; coins: number; inJail: boolean; isBankrupt: boolean; isActive: boolean
}

interface GameState {
  gameId: number; theme: string; board: Cell[]
  properties: Record<number, PropertyState>
  players: PlayerState[]
  currentPlayerIdx: number; turnNumber: number
  lastDice: [number, number] | null; status: string; winnerUserId: number | null
}

export const useGameStore = defineStore('game', () => {
  const authStore  = useAuthStore()
  const gameState  = ref<GameState | null>(null)
  const myPlayerId = ref<number | null>(null)
  const eventLog   = ref<{ icon: string; text: string; time: string }[]>([])

  const isMyTurn = computed(() => {
    if (!gameState.value || myPlayerId.value === null) return false
    const activePlayers = gameState.value.players.filter(p => p.isActive)
    const current = activePlayers[gameState.value.currentPlayerIdx]
    return current?.id === myPlayerId.value
  })

  function updateState(state: GameState) {
    gameState.value = state
  }

  function addLog(icon: string, text: string) {
    eventLog.value.unshift({ icon, text, time: new Date().toLocaleTimeString('ru') })
    if (eventLog.value.length > 20) eventLog.value.pop()
  }

  function rollDice() {
    const { socket } = useGameSocket()
    socket.emit('player:roll_dice')
  }

  function buyProperty() {
    const { socket } = useGameSocket()
    socket.emit('player:buy_property', gameState.value?.players.find(p => p.id === myPlayerId.value)?.position)
  }

  function declineBuy() {
    const { socket } = useGameSocket()
    socket.emit('player:decline_buy')
  }

  function endTurn() {
    const { socket } = useGameSocket()
    socket.emit('player:end_turn')
  }

  function sendChat(message: string) {
    const { socket } = useGameSocket()
    socket.emit('game:chat', message)
  }

  function reclaimControl() {
    const { socket } = useGameSocket()
    socket.emit('player:reclaim_control')
  }

  function buildHouse(cellId: number) {
    const { socket } = useGameSocket()
    socket.emit('player:build_house', cellId)
  }

  function mortgage(cellId: number) {
    const { socket } = useGameSocket()
    socket.emit('player:mortgage', cellId)
  }

  return { gameState, myPlayerId, isMyTurn, eventLog, updateState, addLog, rollDice, buyProperty, declineBuy, endTurn, sendChat, reclaimControl, buildHouse, mortgage }
})
