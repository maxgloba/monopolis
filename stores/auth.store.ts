import { defineStore } from 'pinia'

interface User {
  id: number
  uuid: string
  nickname: string
  avatarUrl: string | null
  role: string
  coinsBalance?: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl as string

  async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const hasBody = !!opts.body
    const res = await fetch(`${baseUrl}${path}`, {
      credentials: 'include',
      headers: {
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {}),
        ...opts.headers,
      },
      ...opts,
    })
    return res.json()
  }

  async function login(email: string, password: string): Promise<void> {
    const res = await apiFetch<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (res.error) throw new Error(res.error.message)
    accessToken.value = res.data.accessToken
    user.value = res.data.user
  }

  async function register(email: string, nickname: string, password: string): Promise<void> {
    const res = await apiFetch<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, nickname, password }),
    })
    if (res.error) throw new Error(res.error.message)
  }

  async function logout(): Promise<void> {
    await apiFetch('/api/auth/logout', { method: 'POST' })
    accessToken.value = null
    user.value = null
  }

  async function refreshToken(): Promise<boolean> {
    const res = await apiFetch<any>('/api/auth/refresh', { method: 'POST' })
    if (res.error) { accessToken.value = null; user.value = null; return false }
    accessToken.value = res.data.accessToken
    await fetchMe()
    return true
  }

  async function fetchMe(): Promise<void> {
    const res = await apiFetch<any>('/api/auth/me')
    if (res.error) { accessToken.value = null; user.value = null; return }
    user.value = res.data
  }

  return { user, accessToken, isAuthenticated, login, register, logout, refreshToken, fetchMe }
})
