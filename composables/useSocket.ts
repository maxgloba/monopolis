import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from '~/stores/auth.store'

let lobbySocket: Socket | null = null
let gameSocket:  Socket | null = null

export function useLobbySocket() {
  const config    = useRuntimeConfig()
  const authStore = useAuthStore()

  if (!lobbySocket) {
    lobbySocket = io(`${config.public.wsUrl}/lobby`, {
      withCredentials: true,
      auth: { token: authStore.accessToken },
      autoConnect: false,
    })
  }

  function connect() {
    lobbySocket!.auth = { token: authStore.accessToken }
    lobbySocket!.connect()
  }
  function disconnect() { lobbySocket!.disconnect() }

  return { socket: lobbySocket, connect, disconnect }
}

export function useGameSocket() {
  const config    = useRuntimeConfig()
  const authStore = useAuthStore()

  if (!gameSocket) {
    gameSocket = io(`${config.public.wsUrl}/game`, {
      withCredentials: true,
      auth: { token: authStore.accessToken },
      autoConnect: false,
    })
  }

  function connect() {
    gameSocket!.auth = { token: authStore.accessToken }
    gameSocket!.connect()
  }
  function disconnect() { gameSocket!.disconnect() }

  return { socket: gameSocket, connect, disconnect }
}
