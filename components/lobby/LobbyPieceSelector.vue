<script setup lang="ts">
const props = defineProps<{
  theme: 'football' | 'hockey' | 'empire' | 'politics'
  takenPieces: string[]
  selectedPiece: string | null
}>()

const emit = defineEmits<{ select: [pieceId: string] }>()

const PIECES = {
  football: [
    { id: 'football_arshavin',   name: 'Аршавин',    years: '1980–' },
    { id: 'football_dzuba',      name: 'Дзюба',      years: '1988–' },
    { id: 'football_akinfeev',   name: 'Акинфеев',   years: '1986–' },
    { id: 'football_cherchesov', name: 'Черчесов',   years: '1963–' },
  ],
  hockey: [
    { id: 'hockey_ovechkin',  name: 'Овечкин',  years: '1985–' },
    { id: 'hockey_malkin',    name: 'Малкин',    years: '1986–' },
    { id: 'hockey_datsyuk',   name: 'Дацюк',    years: '1978–' },
    { id: 'hockey_kaprizov',  name: 'Капризов',  years: '1997–' },
  ],
  empire: [
    { id: 'empire_peter1',     name: 'Пётр I',       years: '1672–1725' },
    { id: 'empire_catherine2', name: 'Екатерина II',  years: '1729–1796' },
    { id: 'empire_nicholas2',  name: 'Николай II',    years: '1868–1918' },
    { id: 'empire_stolypin',   name: 'Столыпин',     years: '1862–1911' },
  ],
  politics: [
    { id: 'politics_gorbachev',    name: 'Горбачёв',    years: '1931–2022' },
    { id: 'politics_yeltsin',      name: 'Ельцин',      years: '1931–2007' },
    { id: 'politics_zhirinovsky',  name: 'Жириновский', years: '1946–2022' },
    { id: 'politics_putin',        name: 'Путин',       years: '1952–' },
  ],
}

const pieces   = computed(() => PIECES[props.theme])
const hovered  = ref<string | null>(null)
const hoveredPiece = computed(() => pieces.value.find(p => p.id === hovered.value))
</script>

<template>
  <div class="relative grid grid-cols-2 gap-4 pb-2">
    <div
      v-for="piece in pieces"
      :key="piece.id"
      class="flex flex-col items-center justify-center gap-[10px] px-3 pt-5 pb-4 border border-noir-border rounded-card cursor-pointer transition-all duration-[150ms] bg-noir-card min-h-[140px]"
      :class="{
        'opacity-25 cursor-not-allowed grayscale': takenPieces.includes(piece.id),
        'border-gold bg-gold/[0.07] piece-selected': selectedPiece === piece.id,
        'hover:border-gold hover:bg-gold/[0.04]': !takenPieces.includes(piece.id),
      }"
      @click="!takenPieces.includes(piece.id) && emit('select', piece.id)"
      @mouseenter="hovered = piece.id"
      @mouseleave="hovered = null"
    >
      <img
        v-if="false"
        :src="`/pieces/${theme}/${piece.id}.svg`"
        :alt="piece.name"
        class="w-[72px] h-[72px] object-contain"
      />
      <span class="font-serif text-[36px] text-gold-muted leading-none select-none">{{ piece.name.slice(0, 2) }}</span>
      <div class="text-center">
        <span class="block text-[11px] text-ivory tracking-[0.5px] text-center">{{ piece.name }}</span>
        <span class="block text-[9px] text-ivory-faint tracking-[1px] text-center mt-0.5">{{ piece.years }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.piece-selected {
  animation: goldPulse 2s ease-in-out infinite;
}

@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(var(--color-gold), 0.2); }
  50%       { box-shadow: 0 0 24px rgba(var(--color-gold), 0.5); }
}
</style>
