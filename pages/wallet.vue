<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'default' })

type Tab = 'coins' | 'real_money' | 'history'

const activeTab = ref<Tab>('coins')
const accessToken = useState<string | null>('accessToken')

const authHeaders = computed(() => ({
  Authorization: `Bearer ${accessToken.value ?? ''}`,
}))

const { data: walletData, refresh: refreshWallet } = useFetch<{
  data: { coinsBalance: number; realMoneyBalance: string } | null
}>('/api/wallet', { headers: authHeaders })

const { data: txData, refresh: refreshTx } = useFetch<{
  data: { items: unknown[]; total: number } | null
}>('/api/wallet/transactions', { headers: authHeaders })

const { data: balanceData } = useFetch<{
  data: { total: number; available: number; locked: number } | null
}>('/api/payments/balance', { headers: authHeaders })

const COIN_PACKAGES = [
  { coins: 1000,  priceRub: 99,  label: '1 000 монет' },
  { coins: 2500,  priceRub: 199, label: '2 500 монет' },
  { coins: 6000,  priceRub: 399, label: '6 000 монет' },
  { coins: 15000, priceRub: 799, label: '15 000 монет' },
]

const { success: toastSuccess, error: toastError } = useToast()

async function buyPackage(index: number) {
  try {
    await $fetch('/api/wallet/purchase', {
      method: 'POST',
      headers: authHeaders.value,
      body: { packageIndex: index },
    })
    toastSuccess(`Куплено ${COIN_PACKAGES[index].label}!`)
    refreshWallet()
  } catch {
    toastError('Ошибка при покупке')
  }
}

const withdrawForm = reactive({ amount: '', method: 'card', details: '' })

async function submitWithdraw() {
  try {
    await $fetch('/api/payments/withdraw', {
      method: 'POST',
      headers: authHeaders.value,
      body: {
        amount: Number(withdrawForm.amount),
        method: withdrawForm.method,
        details: { info: withdrawForm.details },
      },
    })
    toastSuccess('Заявка на вывод создана')
    withdrawForm.amount = ''
    withdrawForm.details = ''
  } catch {
    toastError('Ошибка при создании заявки')
  }
}

function txStatusClass(status: string) {
  if (status === 'completed') return 'status-completed'
  if (status === 'pending' || status === 'under_review') return 'status-pending'
  return 'status-failed'
}

function formatDate(d: unknown) {
  if (!d) return '—'
  return new Date(d as string).toLocaleDateString('ru-RU')
}
</script>

<template>
  <div class="max-w-[800px] mx-auto py-10 px-6">
    <h1 class="font-serif text-[32px] text-gold tracking-[3px] mb-8">Кошелёк</h1>

    <div class="flex border-b border-noir-border mb-8">
      <button
        class="px-6 py-3 bg-transparent border-none font-sans text-[11px] tracking-[2px] uppercase cursor-pointer border-b-2 transition-all duration-[150ms]"
        :class="activeTab === 'coins' ? 'text-gold border-gold' : 'text-ivory-muted border-transparent hover:text-ivory'"
        @click="activeTab = 'coins'"
      >
        Монеты
      </button>
      <button
        class="px-6 py-3 bg-transparent border-none font-sans text-[11px] tracking-[2px] uppercase cursor-pointer border-b-2 transition-all duration-[150ms]"
        :class="activeTab === 'real_money' ? 'text-gold border-gold' : 'text-ivory-muted border-transparent hover:text-ivory'"
        @click="activeTab = 'real_money'"
      >
        Real Money
      </button>
      <button
        class="px-6 py-3 bg-transparent border-none font-sans text-[11px] tracking-[2px] uppercase cursor-pointer border-b-2 transition-all duration-[150ms]"
        :class="activeTab === 'history' ? 'text-gold border-gold' : 'text-ivory-muted border-transparent hover:text-ivory'"
        @click="activeTab = 'history'"
      >
        История
      </button>
    </div>

    <div v-if="activeTab === 'coins'" class="wallet-section">
      <div class="text-center mb-10">
        <span class="block font-serif text-[56px] text-gold leading-none">{{ walletData?.data?.coinsBalance ?? 0 }}</span>
        <span class="block text-label tracking-[3px] uppercase text-gold-muted mt-2">монет</span>
      </div>

      <h2 class="font-serif text-[18px] text-ivory tracking-[2px] mb-5">Пополнить монеты</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="(pkg, i) in COIN_PACKAGES"
          :key="i"
          class="package-card relative bg-noir-card border border-noir-border rounded-imperial py-5 px-4 flex flex-col gap-3 items-center text-center"
        >
          <div class="font-serif text-[16px] text-gold">{{ pkg.label }}</div>
          <div class="text-label tracking-[1px] text-ivory-muted">{{ pkg.priceRub }} ₽</div>
          <UiButton size="sm" full @click="buyPackage(i)">Купить</UiButton>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'real_money'" class="wallet-section">
      <div class="flex gap-6 mb-10">
        <div class="flex-1 bg-noir-card border border-noir-border rounded-imperial p-6 text-center">
          <span class="block font-serif text-[56px] text-gold leading-none">{{ balanceData?.data?.available?.toFixed(2) ?? '0.00' }} ₽</span>
          <span class="block text-label tracking-[3px] uppercase text-gold-muted mt-2">доступно для вывода</span>
        </div>
        <div class="flex-1 bg-noir-card border border-noir-border rounded-imperial p-6 text-center">
          <span class="block font-serif text-[32px] text-ivory-muted leading-none">{{ balanceData?.data?.locked?.toFixed(2) ?? '0.00' }} ₽</span>
          <span class="block text-label tracking-[3px] uppercase text-gold-muted mt-2">заблокировано (30 дней)</span>
        </div>
      </div>

      <h2 class="font-serif text-[18px] text-ivory tracking-[2px] mb-5">Вывод средств</h2>
      <form class="flex flex-col gap-4 max-w-[400px]" @submit.prevent="submitWithdraw">
        <UiInput
          v-model="withdrawForm.amount"
          label="Сумма (мин. 500 ₽)"
          type="number"
          placeholder="500"
        />
        <div>
          <label class="block text-label tracking-[2px] uppercase text-gold-muted mb-1">Метод</label>
          <select v-model="withdrawForm.method" class="w-full py-[11px] px-[14px] bg-noir-surface border border-noir-border border-b-gold text-ivory font-sans outline-none rounded-imperial">
            <option value="card">Банковская карта</option>
            <option value="sbp">СБП</option>
          </select>
        </div>
        <UiInput
          v-model="withdrawForm.details"
          label="Реквизиты"
          placeholder="Номер карты или телефон"
        />
        <UiButton type="submit" full>Подать заявку</UiButton>
      </form>
    </div>

    <div v-if="activeTab === 'history'" class="wallet-section">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left text-label tracking-[2px] uppercase text-gold-muted py-2 px-3 border-b border-noir-border">Тип</th>
            <th class="text-left text-label tracking-[2px] uppercase text-gold-muted py-2 px-3 border-b border-noir-border">Направление</th>
            <th class="text-left text-label tracking-[2px] uppercase text-gold-muted py-2 px-3 border-b border-noir-border">Сумма</th>
            <th class="text-left text-label tracking-[2px] uppercase text-gold-muted py-2 px-3 border-b border-noir-border">Валюта</th>
            <th class="text-left text-label tracking-[2px] uppercase text-gold-muted py-2 px-3 border-b border-noir-border">Статус</th>
            <th class="text-left text-label tracking-[2px] uppercase text-gold-muted py-2 px-3 border-b border-noir-border">Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in (txData?.data?.items ?? [])" :key="(tx as any).id">
            <td class="p-3 text-ivory-muted text-[13px] border-b border-noir-border/50">{{ (tx as any).type }}</td>
            <td class="p-3 text-ivory-muted text-[13px] border-b border-noir-border/50">{{ (tx as any).direction === 'credit' ? '+' : '−' }}</td>
            <td class="p-3 text-ivory-muted text-[13px] border-b border-noir-border/50">{{ (tx as any).amount }}</td>
            <td class="p-3 text-ivory-muted text-[13px] border-b border-noir-border/50">{{ (tx as any).currency }}</td>
            <td class="p-3 text-ivory-muted text-[13px] border-b border-noir-border/50">
              <span :class="['tx-status', txStatusClass((tx as any).status)]">{{ (tx as any).status }}</span>
            </td>
            <td class="p-3 text-ivory-muted text-[13px] border-b border-noir-border/50">{{ formatDate((tx as any).createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!txData?.data?.items?.length" class="text-ivory-faint text-center py-10 text-[13px]">Транзакций пока нет</p>
    </div>
  </div>
</template>

<style scoped>
.wallet-section {
  animation: fadeIn 200ms ease;
}

.package-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
}

.tx-status {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 2px;
}

.status-completed {
  color: var(--color-theme-football);
  background: color-mix(in srgb, var(--color-theme-football) 10%, transparent);
  border: 1px solid var(--color-theme-football);
}

.status-pending {
  color: var(--color-gold);
  background: color-mix(in srgb, var(--color-gold) 10%, transparent);
  border: 1px solid var(--color-gold);
}

.status-failed {
  color: var(--color-theme-politics);
  background: color-mix(in srgb, var(--color-theme-politics) 10%, transparent);
  border: 1px solid var(--color-theme-politics);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
