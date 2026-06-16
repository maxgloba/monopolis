<script setup lang="ts">
interface ShopItem {
  id: number
  type: string
  name: string
  theme: string | null
  priceCoins: number | null
  priceRub: string | null
  previewUrl: string | null
}

const props = defineProps<{
  item: ShopItem
  isOwned: boolean
  isEquipped: boolean
}>()

const emit = defineEmits<{
  buy: [id: number]
  equip: [id: number]
}>()

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<template>
  <div class="relative bg-noir-card border border-noir-border rounded-imperial p-4 flex flex-col gap-[10px] transition-all duration-[150ms] hover:scale-[1.02] card-shimmer">
    <div class="aspect-square bg-noir-surface rounded-imperial overflow-hidden flex items-center justify-center">
      <img v-if="item.previewUrl" :src="item.previewUrl" :alt="item.name" class="w-full h-full object-cover" />
      <div v-else class="font-serif text-[24px] text-gold tracking-[2px]">{{ getInitials(item.name) }}</div>
    </div>

    <h3 class="font-serif text-[14px] text-gold tracking-[1px] leading-[1.3]">{{ item.name }}</h3>

    <div class="flex flex-col gap-[2px]">
      <span v-if="item.priceCoins" class="text-label text-gold-muted tracking-[1px]">{{ item.priceCoins }} 🪙</span>
      <span v-if="item.priceRub" class="text-label text-ivory-muted tracking-[1px]">{{ item.priceRub }} ₽</span>
    </div>

    <span v-if="isEquipped" class="text-[10px] tracking-[1px] uppercase text-theme-football text-center">Экипировано ✓</span>
    <UiButton
      v-else-if="isOwned"
      variant="secondary"
      size="sm"
      full
      @click="emit('equip', item.id)"
    >
      Экипировать
    </UiButton>
    <UiButton
      v-else
      size="sm"
      full
      @click="emit('buy', item.id)"
    >
      {{ item.priceCoins ? `${item.priceCoins} 🪙` : `${item.priceRub} ₽` }}
    </UiButton>
  </div>
</template>

<style scoped>
.card-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, theme('colors.gold.faint'), transparent);
}
</style>
