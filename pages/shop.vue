<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'default' })

type ShopTab = 'piece_skin' | 'board_skin' | 'profile_frame' | 'victory_anim' | 'chat_emoji'

interface ShopItem {
  id: number
  type: string
  name: string
  theme: string | null
  priceCoins: number | null
  priceRub: string | null
  previewUrl: string | null
}

interface UserItem {
  itemId: number
  isEquipped: number
}

const activeTab = ref<ShopTab>('piece_skin')
const accessToken = useState<string | null>('accessToken')

const authHeaders = computed(() => ({
  Authorization: `Bearer ${accessToken.value ?? ''}`,
}))

const { data: itemsData, refresh: refreshItems } = useFetch<{ data: ShopItem[] | null }>(
  () => `/api/shop/items?type=${activeTab.value}`,
  { headers: authHeaders },
)

const { data: myItemsData, refresh: refreshMyItems } = useFetch<{ data: UserItem[] | null }>(
  '/api/shop/my-items',
  { headers: authHeaders },
)

const items = computed(() => itemsData.value?.data ?? [])
const myItems = computed(() => myItemsData.value?.data ?? [])

function isOwned(itemId: number) {
  return myItems.value.some(i => i.itemId === itemId)
}

function isEquipped(itemId: number) {
  return myItems.value.some(i => i.itemId === itemId && i.isEquipped === 1)
}

const { success: toastSuccess, error: toastError } = useToast()

async function handleBuy(itemId: number) {
  try {
    await $fetch('/api/shop/buy', {
      method: 'POST',
      headers: authHeaders.value,
      body: { itemId },
    })
    toastSuccess('Куплено!')
    refreshMyItems()
  } catch {
    toastError('Ошибка при покупке')
  }
}

async function handleEquip(itemId: number) {
  try {
    await $fetch('/api/shop/equip', {
      method: 'PUT',
      headers: authHeaders.value,
      body: { itemId },
    })
    toastSuccess('Экипировано!')
    refreshMyItems()
  } catch {
    toastError('Ошибка')
  }
}

const TABS: { key: ShopTab; label: string }[] = [
  { key: 'piece_skin',    label: 'Фишки' },
  { key: 'board_skin',    label: 'Доски' },
  { key: 'profile_frame', label: 'Рамки' },
  { key: 'victory_anim',  label: 'Анимации' },
  { key: 'chat_emoji',    label: 'Эмодзи' },
]
</script>

<template>
  <div class="max-w-[1000px] mx-auto px-6 py-10">
    <h1 class="font-serif text-[32px] text-gold tracking-[3px] mb-8">Магазин скинов</h1>

    <div class="flex border-b border-noir-border mb-8">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="px-5 py-3 bg-transparent border-none font-sans text-[11px] tracking-[2px] uppercase cursor-pointer border-b-2 border-transparent transition-all duration-[150ms]"
        :class="activeTab === tab.key ? 'text-gold border-b-gold' : 'text-ivory-muted hover:text-ivory'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 min-[900px]:grid-cols-4 gap-4">
      <ShopItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :is-owned="isOwned(item.id)"
        :is-equipped="isEquipped(item.id)"
        @buy="handleBuy"
        @equip="handleEquip"
      />
    </div>

    <p v-if="items.length === 0" class="text-ivory-faint text-center py-[60px] text-[13px]">В этом разделе пока нет товаров</p>
  </div>
</template>
