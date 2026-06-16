<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

interface AdminUser {
  id: number
  nickname: string
  email: string
  role: string
  coinsBalance: number
  isBanned: number
  isFrozen: number
  createdAt: string
}

const accessToken = useState<string | null>('accessToken')
const authHeaders = computed(() => ({ Authorization: `Bearer ${accessToken.value ?? ''}` }))

const searchInput = ref('')
const searchQuery = ref('')
const page = ref(1)

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = val
    page.value = 1
  }, 300)
})

const url = computed(() => {
  const q = new URLSearchParams({ page: String(page.value), limit: '20' })
  if (searchQuery.value) q.set('search', searchQuery.value)
  return `/api/admin/users?${q}`
})

const { data, refresh } = useFetch<{ data: { items: AdminUser[] } | null }>(url, { headers: authHeaders })
const userList = computed(() => data.value?.data?.items ?? [])

function statusLabel(u: AdminUser) {
  if (u.isBanned) return 'Заблокирован'
  if (u.isFrozen) return 'Заморожен'
  return 'Активен'
}

function statusVariant(u: AdminUser): 'danger' | 'ivory' | 'gold' {
  if (u.isBanned) return 'danger'
  if (u.isFrozen) return 'ivory'
  return 'gold'
}

const { success: toastSuccess, error: toastError } = useToast()

async function banUser(id: number) {
  try {
    await $fetch(`/api/admin/users/${id}/ban`, { method: 'PUT', headers: authHeaders.value })
    toastSuccess('Пользователь заблокирован')
    refresh()
  } catch { toastError('Ошибка') }
}

async function freezeUser(id: number) {
  try {
    await $fetch(`/api/admin/users/${id}/freeze`, { method: 'PUT', headers: authHeaders.value })
    toastSuccess('Аккаунт заморожен')
    refresh()
  } catch { toastError('Ошибка') }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU')
}
</script>

<template>
  <div class="users-page">
    <h1 class="users-title">Пользователи</h1>

    <div class="search-row">
      <UiInput
        v-model="searchInput"
        placeholder="Поиск по никнейму..."
      />
    </div>

    <table class="users-table">
      <thead>
        <tr>
          <th>Никнейм</th>
          <th>Email</th>
          <th>Монеты</th>
          <th>Роль</th>
          <th>Статус</th>
          <th>Дата рег.</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in userList" :key="u.id">
          <td>{{ u.nickname }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.coinsBalance }}</td>
          <td>{{ u.role }}</td>
          <td><UiBadge :variant="statusVariant(u)" size="sm">{{ statusLabel(u) }}</UiBadge></td>
          <td>{{ formatDate(u.createdAt) }}</td>
          <td>
            <div class="action-row">
              <UiButton
                v-if="!u.isBanned && u.role === 'user'"
                variant="danger"
                size="sm"
                @click="banUser(u.id)"
              >
                Бан
              </UiButton>
              <UiButton
                v-if="!u.isFrozen && u.role === 'user'"
                variant="ghost"
                size="sm"
                @click="freezeUser(u.id)"
              >
                Заморозить
              </UiButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <UiButton variant="ghost" size="sm" :disabled="page === 1" @click="page--">← Назад</UiButton>
      <span class="pagination-page">Страница {{ page }}</span>
      <UiButton variant="ghost" size="sm" :disabled="userList.length < 20" @click="page++">Вперёд →</UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.users-page { max-width: 1100px; }

.users-title {
  font-family: $font-serif;
  font-size: 28px;
  color: $gold;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

.search-row {
  max-width: 320px;
  margin-bottom: 24px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    font-size: $text-label;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: $gold-muted;
    padding: 8px 12px;
    border-bottom: 1px solid $noir-border;
  }

  td {
    padding: 12px;
    color: $ivory-muted;
    font-size: 13px;
    border-bottom: 1px solid rgba($noir-border, 0.5);
  }

  tr:hover td { background: $noir-card; }
}

.action-row {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-page {
  font-size: $text-label;
  letter-spacing: 1px;
  color: $ivory-muted;
}
</style>
