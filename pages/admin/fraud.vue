<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

interface FraudFlag {
  userId: number
  reason: string
  createdAt: string
}

const accessToken = useState<string | null>('accessToken')

const { data } = useFetch<{ data: FraudFlag[] | null }>('/api/admin/fraud-flags', {
  headers: computed(() => ({ Authorization: `Bearer ${accessToken.value ?? ''}` })),
})

const flags = computed(() => data.value?.data ?? [])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU')
}
</script>

<template>
  <div class="fraud-page">
    <h1 class="fraud-title">Подозрительные аккаунты</h1>

    <table class="fraud-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Причина заморозки</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="flag in flags" :key="`${flag.userId}-${flag.createdAt}`">
          <td>{{ flag.userId }}</td>
          <td>{{ flag.reason }}</td>
          <td>{{ formatDate(flag.createdAt) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="flags.length === 0" class="empty-msg">Подозрительных аккаунтов нет</p>
  </div>
</template>

<style lang="scss" scoped>
.fraud-page { max-width: 800px; }

.fraud-title {
  font-family: $font-serif;
  font-size: 28px;
  color: $gold;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

.fraud-table {
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

.empty-msg {
  color: $ivory-faint;
  text-align: center;
  padding: 40px 0;
  font-size: 13px;
}
</style>
