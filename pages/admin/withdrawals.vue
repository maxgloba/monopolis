<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

interface Withdrawal {
  id: number
  userId: number
  amount: string
  providerRef: string | null
  status: string
  createdAt: string
}

const accessToken = useState<string | null>('accessToken')
const authHeaders = computed(() => ({ Authorization: `Bearer ${accessToken.value ?? ''}` }))

const { data, refresh } = useFetch<{ data: Withdrawal[] | null }>('/api/admin/withdrawals', { headers: authHeaders })
const withdrawals = computed(() => data.value?.data ?? [])

const { success: toastSuccess, error: toastError } = useToast()

async function approve(id: number) {
  try {
    await $fetch(`/api/admin/withdrawals/${id}`, {
      method: 'PUT',
      headers: authHeaders.value,
      body: { action: 'approve' },
    })
    toastSuccess('Выплата одобрена')
    refresh()
  } catch { toastError('Ошибка') }
}

async function reject(id: number) {
  const reason = prompt('Укажите причину отклонения:')
  if (!reason) return
  try {
    await $fetch(`/api/admin/withdrawals/${id}`, {
      method: 'PUT',
      headers: authHeaders.value,
      body: { action: 'reject', reason },
    })
    toastSuccess('Заявка отклонена')
    refresh()
  } catch { toastError('Ошибка') }
}

function getMethod(ref: string | null) {
  if (!ref) return '—'
  try { return JSON.parse(ref).method ?? '—' } catch { return '—' }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU')
}
</script>

<template>
  <div class="withdrawals-page">
    <h1 class="withdrawals-title">Заявки на вывод</h1>

    <table class="withdrawals-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Пользователь</th>
          <th>Сумма</th>
          <th>Метод</th>
          <th>Дата</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in withdrawals" :key="w.id">
          <td>{{ w.id }}</td>
          <td>{{ w.userId }}</td>
          <td>{{ w.amount }} ₽</td>
          <td>{{ getMethod(w.providerRef) }}</td>
          <td>{{ formatDate(w.createdAt) }}</td>
          <td>
            <UiBadge variant="ivory" size="sm">{{ w.status }}</UiBadge>
          </td>
          <td>
            <div class="action-row">
              <UiButton size="sm" @click="approve(w.id)">Одобрить</UiButton>
              <UiButton variant="danger" size="sm" @click="reject(w.id)">Отклонить</UiButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="withdrawals.length === 0" class="empty-msg">Нет заявок на рассмотрении</p>
  </div>
</template>

<style lang="scss" scoped>
.withdrawals-page { max-width: 1000px; }

.withdrawals-title {
  font-family: $font-serif;
  font-size: 28px;
  color: $gold;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

.withdrawals-table {
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

.empty-msg {
  color: $ivory-faint;
  text-align: center;
  padding: 40px 0;
  font-size: 13px;
}
</style>
