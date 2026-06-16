<script setup lang="ts">
const props = defineProps<{
  cell: {
    id: number; type: string; name: string
    price?: number; group?: number; color?: string; bonus?: number; amount?: number
  }
  property?: { ownerId: number | null; houses: number; hotel: boolean; mortgaged: boolean } | null
  pieces:    { playerId: number; pieceId: string; position: number }[]
  gridPos:   { col: number; row: number }
}>()

const TYPE_ICONS: Record<string, string> = {
  go:           '★',
  jail:         '⛓',
  go_to_jail:   '→⛓',
  free_parking: '🅿',
  tax:          '💸',
  chance:       '?',
  treasury:     '🏦',
  railway:      '🚂',
  utility:      '⚡',
}

const icon = computed(() => props.cell.color ? null : TYPE_ICONS[props.cell.type] || '')
</script>

<template>
  <div
    class="cell"
    :class="[`cell-${cell.type}`, { mortgaged: property?.mortgaged }]"
    :style="{ gridColumn: gridPos.col, gridRow: gridPos.row }"
  >
    <div v-if="cell.color" class="cell-color-bar" :style="{ background: cell.color }"></div>
    <div class="cell-name">{{ cell.name.split(' ').slice(0,2).join(' ') }}</div>
    <div v-if="icon" class="cell-icon">{{ icon }}</div>
    <div v-if="cell.price" class="cell-price">{{ cell.price }}</div>
    <div v-if="cell.amount" class="cell-tax">-{{ cell.amount }}</div>
    <div class="cell-buildings">
      <div v-if="property?.hotel" class="building hotel">H</div>
      <div v-else v-for="h in property?.houses" :key="h" class="building house"></div>
    </div>
    <div class="cell-pieces">
      <div
        v-for="(p, i) in pieces"
        :key="p.playerId"
        class="cell-piece"
        :style="{ transform: `translateX(${i * 8}px)` }"
      >
        <img :src="`/pieces/default/${p.pieceId}.svg`" :alt="`piece-${p.playerId}`" />
      </div>
    </div>
    <div v-if="property?.mortgaged" class="cell-mortgage">ИПОТЕКА</div>
  </div>
</template>

<style lang="scss" scoped>
.cell {
  position: relative;
  background: $noir-surface;
  border: 1px solid $noir-border;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  overflow: hidden;
  min-height: 0;

  &-color-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
  }

  &-name {
    font-size: 7px;
    color: $ivory-muted;
    text-align: center;
    letter-spacing: 0.5px;
    line-height: 1.2;
    padding: 0 2px;
  }

  &-icon { font-size: 14px; }
  &-price { font-size: 7px; color: $gold; }
  &-tax   { font-size: 7px; color: $theme-politics; }

  &-buildings {
    display: flex;
    gap: 1px;
    flex-wrap: wrap;
    justify-content: center;
  }

  &-pieces {
    position: absolute;
    bottom: 2px;
    left: 2px;
    display: flex;
    img { width: 12px; height: 12px; }
  }

  &-mortgage {
    position: absolute;
    inset: 0;
    background: rgba($noir, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6px;
    color: $gold-muted;
    letter-spacing: 1px;
  }
}

.building {
  width: 6px; height: 6px; border-radius: 1px;

  &.house { background: $theme-football; }
  &.hotel { background: $theme-politics; width: 10px; font-size: 6px; color: white; display: flex; align-items: center; justify-content: center; }
}
</style>
