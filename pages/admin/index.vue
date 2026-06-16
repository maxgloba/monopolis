<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const accessToken = useState<string | null>('accessToken')

const { data } = useFetch<{
  data: { dau: number; revenueToday: number; activeGames: number; newUsersToday: number } | null
}>('/api/admin/stats', {
  headers: computed(() => ({ Authorization: `Bearer ${accessToken.value ?? ''}` })),
})

const stats = computed(() => data.value?.data)
</script>

<template>
  <div class="admin-dash">
    <h1 class="dash-title">Дашборд</h1>

    <div class="metrics">
      <div class="metric-card">
        <span class="metric-value">{{ stats?.dau ?? 0 }}</span>
        <span class="metric-label">Активных сегодня</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">{{ stats?.revenueToday?.toFixed(0) ?? 0 }} ₽</span>
        <span class="metric-label">Выручка сегодня</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">{{ stats?.activeGames ?? 0 }}</span>
        <span class="metric-label">Активные партии</span>
      </div>
      <div class="metric-card">
        <span class="metric-value">{{ stats?.newUsersToday ?? 0 }}</span>
        <span class="metric-label">Новые пользователи</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-dash {
  max-width: 900px;
}

.dash-title {
  font-family: $font-serif;
  font-size: 28px;
  color: $gold;
  letter-spacing: 3px;
  margin-bottom: 32px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (min-width: 700px) { grid-template-columns: repeat(4, 1fr); }
}

.metric-card {
  position: relative;
  background: $noir-card;
  border: 1px solid $noir-border;
  border-radius: $radius-sharp;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $gold, transparent);
  }
}

.metric-value {
  font-family: $font-serif;
  font-size: 36px;
  color: $gold;
  line-height: 1;
}

.metric-label {
  font-size: $text-label;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $ivory-muted;
}
</style>
