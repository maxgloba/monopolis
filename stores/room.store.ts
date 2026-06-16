import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'

interface Room {
  id: number
  code: string | null
  hostUserId: number
  theme: 'football' | 'hockey' | 'empire' | 'politics'
  gameType: 'virtual' | 'real_money'
  betAmount: string | null
  botDifficulty: 'easy' | 'medium' | 'hard'
  status: 'waiting' | 'starting' | 'in_game' | 'finished'
  maxPlayers: number
  createdAt: string
}

interface RoomPlayer {
  userId: number | null
  nickname: string
  avatarUrl: string | null
  pieceId: string | null
  isReady: boolean
  isBot: boolean
}

interface CurrentRoom extends Room {
  players: RoomPlayer[]
}

export const useRoomStore = defineStore('room', () => {
  const rooms       = ref<Room[]>([])
  const currentRoom = ref<CurrentRoom | null>(null)
  const authStore   = useAuthStore()

  const config  = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl as string

  function authHeaders(withBody = false) {
    return {
      ...(withBody ? { 'Content-Type': 'application/json' } : {}),
      ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}),
    }
  }

  async function fetchActiveGame(): Promise<number | null> {
    const res  = await fetch(`${baseUrl}/api/rooms/my-active-game`, { credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    return json.data?.gameId ?? null
  }

  async function fetchRooms(filters: { theme?: string; game_type?: string } = {}) {
    const params = new URLSearchParams()
    if (filters.theme)     params.set('theme', filters.theme)
    if (filters.game_type) params.set('game_type', filters.game_type)
    const res  = await fetch(`${baseUrl}/api/rooms?${params}`, { credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (!json.error) rooms.value = json.data
  }

  async function createRoom(data: {
    theme: Room['theme']
    gameType: Room['gameType']
    betAmount?: number
    isPrivate?: boolean
    botDifficulty?: Room['botDifficulty']
    maxPlayers?: number
  }): Promise<{ id: number; code: string | null }> {
    const res  = await fetch(`${baseUrl}/api/rooms`, { method: 'POST', credentials: 'include', headers: authHeaders(true), body: JSON.stringify(data) })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    return json.data
  }

  async function joinRoom(id: number) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}/join`, { method: 'POST', credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
  }

  async function setReady(id: number) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}/ready`, { method: 'POST', credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
  }

  async function selectPiece(id: number, pieceId: string) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}/piece`, { method: 'POST', credentials: 'include', headers: authHeaders(true), body: JSON.stringify({ pieceId }) })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
  }

  async function fetchRoom(id: number) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}`, { credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (!json.error) currentRoom.value = { ...json.data, players: currentRoom.value?.players ?? [] }
    return json
  }

  async function addBot(id: number) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}/take-bot-slot`, { method: 'POST', credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
  }

  async function startGame(id: number) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}/start`, { method: 'POST', credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
  }

  async function deleteRoom(id: number) {
    const res  = await fetch(`${baseUrl}/api/rooms/${id}`, { method: 'DELETE', credentials: 'include', headers: authHeaders() })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    rooms.value = rooms.value.filter(r => r.id !== id)
  }

  return { rooms, currentRoom, fetchRooms, fetchActiveGame, createRoom, joinRoom, setReady, selectPiece, fetchRoom, addBot, startGame, deleteRoom }
})
