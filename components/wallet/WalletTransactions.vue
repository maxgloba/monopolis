<script setup lang="ts">
import UiBadge from '~/components/ui/UiBadge.vue'

export interface Transaction {
  id: string | number
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss' | 'bonus' | 'purchase' | 'refund'
  currency: string
  amount: number
  direction: 'credit' | 'debit'
  status: string
  createdAt: string
}

defineProps<{
  transactions: Transaction[]
  loading?: boolean
}>()

const TYPE_LABELS: Record<Transaction['type'], string> = {
  deposit:    'Депозит',
  withdrawal: 'Вывод',
  game_win:   'Выигрыш',
  game_loss:  'Проигрыш',
  bonus:      'Бонус',
  purchase:   'Покупка',
  refund:     'Возврат',
}

const TYPE_CLASS: Record<Transaction['type'], string> = {
  deposit:    'text-gold',
  withdrawal: 'text-ivory-muted',
  game_win:   'text-[#4CAF50]',
  game_loss:  'text-[#EF5350]',
  bonus:      'text-gold',
  purchase:   'text-ivory-muted',
  refund:     'text-ivory-muted',
}

const STATUS_VARIANT: Record<string, 'gold' | 'ivory' | 'success' | 'danger'> = {
  completed: 'success',
  pending:   'gold',
  failed:    'danger',
  cancelled: 'ivory',
}

function statusVariant(status: string): 'gold' | 'ivory' | 'success' | 'danger' {
  return STATUS_VARIANT[status] ?? 'ivory'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
  }) + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatAmount(t: Transaction): string {
  const prefix = t.direction === 'credit' ? '+' : '-'
  return `${prefix}${t.amount.toLocaleString('ru-RU')} ${t.currency}`
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full border-collapse font-sans text-[13px]">
      <thead>
        <tr class="border-b border-noir-border">
          <th class="px-[14px] py-[10px] text-left text-[10px] font-normal tracking-[2px] uppercase text-gold whitespace-nowrap">Дата</th>
          <th class="px-[14px] py-[10px] text-left text-[10px] font-normal tracking-[2px] uppercase text-gold whitespace-nowrap">Тип</th>
          <th class="px-[14px] py-[10px] text-left text-[10px] font-normal tracking-[2px] uppercase text-gold whitespace-nowrap">Валюта</th>
          <th class="px-[14px] py-[10px] text-left text-[10px] font-normal tracking-[2px] uppercase text-gold whitespace-nowrap">Сумма</th>
          <th class="px-[14px] py-[10px] text-left text-[10px] font-normal tracking-[2px] uppercase text-gold whitespace-nowrap">Статус</th>
        </tr>
      </thead>

      <tbody>
        <!-- Skeleton rows -->
        <template v-if="loading">
          <tr v-for="n in 5" :key="`sk-${n}`" class="border-b border-noir-border/60 bg-noir-surface">
            <td class="px-[14px] py-[14px] align-middle"><span class="skel inline-block rounded-imperial h-[12px] w-[110px]" /></td>
            <td class="px-[14px] py-[14px] align-middle"><span class="skel inline-block rounded-imperial h-[12px] w-[70px]" /></td>
            <td class="px-[14px] py-[14px] align-middle"><span class="skel inline-block rounded-imperial h-[12px] w-[40px]" /></td>
            <td class="px-[14px] py-[14px] align-middle"><span class="skel inline-block rounded-imperial h-[12px] w-[80px]" /></td>
            <td class="px-[14px] py-[14px] align-middle"><span class="skel inline-block rounded-imperial h-[12px] w-[60px]" /></td>
          </tr>
        </template>

        <!-- Empty state -->
        <template v-else-if="!transactions.length">
          <tr>
            <td colspan="5" class="text-center py-10">
              <span class="font-serif text-[14px] text-ivory-faint tracking-[1px]">История пуста</span>
            </td>
          </tr>
        </template>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="border-b border-noir-border/60 bg-noir-surface transition-all duration-[150ms] hover:bg-noir-surface/95"
          >
            <td class="px-[14px] py-[12px] align-middle whitespace-nowrap text-[12px] text-ivory-faint">{{ formatDate(tx.createdAt) }}</td>
            <td class="px-[14px] py-[12px] align-middle">
              <span class="text-[12px] font-normal" :class="TYPE_CLASS[tx.type]">
                {{ TYPE_LABELS[tx.type] }}
              </span>
            </td>
            <td class="px-[14px] py-[12px] align-middle font-medium text-ivory-muted tracking-[1px] uppercase text-label">{{ tx.currency }}</td>
            <td
              class="px-[14px] py-[12px] align-middle font-semibold whitespace-nowrap"
              :class="tx.direction === 'credit' ? 'text-[#4CAF50]' : 'text-[#EF5350]'"
            >
              {{ formatAmount(tx) }}
            </td>
            <td class="px-[14px] py-[12px] align-middle">
              <UiBadge :variant="statusVariant(tx.status)" size="sm">
                {{ tx.status }}
              </UiBadge>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.skel {
  background: linear-gradient(90deg, theme('colors.noir-border') 25%, color-mix(in srgb, theme('colors.noir-border') 96%, white) 50%, theme('colors.noir-border') 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
