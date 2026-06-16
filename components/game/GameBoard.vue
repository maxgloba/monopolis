<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  gameState: {
    board: any[]
    properties: Record<number, any>
    players: any[]
    theme: string
    currentPlayerIdx: number
  }
  myPlayerId: number | null
  visualPositions: Record<number, number>
  currentDice: [number, number] | null
  rolling: boolean
}>()

const emit = defineEmits<{
  cellClick: [cell: any]
}>()

// Позиция в 11x11 сетке для каждой клетки
function cellGridPos(id: number): { col: string; row: string } {
  if (id === 0)  return { col: '1',          row: '11' }
  if (id <= 9)   return { col: `${id + 1}`,  row: '11' }
  if (id === 10) return { col: '11',         row: '11' }
  if (id <= 19)  return { col: '11',         row: `${21 - id}` }
  if (id === 20) return { col: '11',         row: '1' }
  if (id <= 29)  return { col: `${31 - id}`, row: '1' }
  if (id === 30) return { col: '1',          row: '1' }
  return               { col: '1',          row: `${id - 29}` }
}

function cellSide(id: number): 'bottom' | 'right' | 'top' | 'left' | 'corner' {
  if (id === 0 || id === 10 || id === 20 || id === 30) return 'corner'
  if (id <= 9)  return 'bottom'
  if (id <= 19) return 'right'
  if (id <= 29) return 'top'
  return 'left'
}

const PLAYER_COLORS = ['#D4A017', '#4CAF50', '#2196F3', '#E91E63']

// Фишки: позиции всех активных игроков (через visualPositions для анимации)
const piecesOnCell = computed(() => {
  const map: Record<number, { playerId: number; nickname: string; idx: number; isMe: boolean; isCurrent: boolean }[]> = {}
  const currentPlayer = props.gameState.players[props.gameState.currentPlayerIdx]
  for (let i = 0; i < props.gameState.players.length; i++) {
    const p = props.gameState.players[i]
    if (!p.isActive || p.isBankrupt) continue
    const pos = props.visualPositions[p.id] ?? p.position
    if (!map[pos]) map[pos] = []
    map[pos].push({
      playerId: p.id,
      nickname: p.nickname,
      idx: i,
      isMe: p.id === props.myPlayerId,
      isCurrent: p.id === currentPlayer?.id,
    })
  }
  return map
})

// Владелец клетки
function ownerInfo(cellId: number): { color: string; letter: string } | null {
  const prop = props.gameState.properties[cellId]
  if (!prop || prop.ownerId == null) return null
  const idx = props.gameState.players.findIndex(p => p.id === prop.ownerId)
  if (idx < 0) return null
  const player = props.gameState.players[idx]
  return { color: PLAYER_COLORS[idx % 4], letter: player.nickname.slice(0, 1).toUpperCase() }
}

// Позиция моей фишки (через visualPositions для анимации)
const myPosition = computed(() => {
  const me = props.gameState.players.find(p => p.id === props.myPlayerId)
  if (!me) return null
  return props.visualPositions[me.id] ?? me.position
})

// Позиция текущего игрока (через visualPositions)
const currentPosition = computed(() => {
  const cur = props.gameState.players[props.gameState.currentPlayerIdx]
  if (!cur) return null
  return props.visualPositions[cur.id] ?? cur.position
})

// Анимация «только что переместился»
const justMovedCell = ref<number | null>(null)
let moveTimer: ReturnType<typeof setTimeout> | null = null

watch(currentPosition, (newPos) => {
  if (newPos === null) return
  if (moveTimer) clearTimeout(moveTimer)
  justMovedCell.value = newPos
  moveTimer = setTimeout(() => { justMovedCell.value = null }, 1500)
})
</script>

<template>
  <div class="board-wrap">
    <div class="board">
      <!-- Клетки -->
      <div
        v-for="cell in gameState.board"
        :key="cell.id"
        class="cell"
        :class="[
          `side-${cellSide(cell.id)}`,
          `type-${cell.type}`,
          {
            'cell-mine':        cell.id === myPosition,
            'cell-current':     cell.id === currentPosition && cell.id !== myPosition,
            'cell-just-moved':  cell.id === justMovedCell,
            'cell-owned':       gameState.properties[cell.id]?.ownerId != null,
            'cell-clickable':   ['property','railway','utility'].includes(cell.type),
          }
        ]"
        @click="['property','railway','utility'].includes(cell.type) && emit('cellClick', cell)"
        :style="{
          gridColumn: cellGridPos(cell.id).col,
          gridRow: cellGridPos(cell.id).row,
          '--bar': cell.color || 'transparent',
          '--oc': ownerInfo(cell.id)?.color ?? 'transparent',
        }"
      >
        <!-- Индикатор владельца -->
        <div
          v-if="ownerInfo(cell.id)"
          class="cell-owner"
          :style="{ '--oc': ownerInfo(cell.id)!.color }"
        >{{ ownerInfo(cell.id)!.letter }}</div>

        <!-- Иконка -->
        <div class="cell-type-icon">
          <span v-if="cell.type === 'go'">★</span>
          <span v-else-if="cell.type === 'jail'">⛓</span>
          <span v-else-if="cell.type === 'go_to_jail'">→⛓</span>
          <span v-else-if="cell.type === 'free_parking'">P</span>
          <span v-else-if="cell.type === 'tax'">💸</span>
          <span v-else-if="cell.type === 'chance'">?</span>
          <span v-else-if="cell.type === 'treasury'">$</span>
          <span v-else-if="cell.type === 'railway'">🚂</span>
          <span v-else-if="cell.type === 'utility'">⚡</span>
        </div>

        <div class="cell-name">{{ cell.name }}</div>
        <div v-if="cell.price" class="cell-price">{{ cell.price }}</div>

        <!-- Дома / отель -->
        <div v-if="gameState.properties[cell.id]" class="cell-buildings">
          <span v-if="gameState.properties[cell.id].hotel" class="hotel">H</span>
          <span v-else v-for="h in gameState.properties[cell.id].houses" :key="h" class="house"></span>
        </div>

        <!-- Фишки игроков -->
        <div v-if="piecesOnCell[cell.id]?.length" class="cell-pieces">
          <div
            v-for="(p, pi) in piecesOnCell[cell.id]"
            :key="p.playerId"
            class="piece"
            :class="{ 'piece-me': p.isMe, 'piece-current': p.isCurrent }"
            :style="{ '--pc': PLAYER_COLORS[p.idx % 4], '--pi': pi }"
            :title="p.nickname"
          >
            <span class="piece-label">{{ p.nickname.slice(0, 1).toUpperCase() }}</span>
          </div>
        </div>
      </div>

      <!-- Центр доски -->
      <div class="board-center">
        <div class="board-center-dice">
          <GameDice :dice="currentDice" :rolling="rolling" />
        </div>
        <div class="board-logo">МОНОПОЛИС</div>
        <div class="board-theme">{{ gameState.theme.toUpperCase() }}</div>
        <div class="board-legend">
          <div
            v-for="(p, i) in gameState.players"
            :key="p.id"
            class="legend-item"
            :class="{ 'legend-active': i === gameState.currentPlayerIdx }"
          >
            <span class="legend-dot" :style="{ background: PLAYER_COLORS[i % 4] }"></span>
            <span class="legend-name">{{ p.nickname }}</span>
            <span class="legend-coins">🪙{{ p.coins }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.board-wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.board {
  display: grid;
  grid-template-columns: 90px repeat(9, 1fr) 90px;
  grid-template-rows:    90px repeat(9, 1fr) 90px;
  width: 100%;
  height: 100%;
  background: #0e1a0e;
  border: 3px solid $gold;
  border-radius: 4px;
  box-shadow:
    0 0 0 1px rgba($gold, 0.2),
    0 8px 40px rgba(0,0,0,0.8),
    inset 0 0 80px rgba(0,0,0,0.4);
}

/* ─── Центр ─── */
.board-center {
  grid-column: 2 / 11;
  grid-row:    2 / 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #0a1a0a;
  border: 1px solid rgba($gold, 0.15);
}

.board-center-dice {
  display: flex;
  justify-content: center;
  transform: scale(1.5);
  transform-origin: center;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.board-logo {
  font-family: $font-serif;
  font-size: clamp(14px, 2vw, 28px);
  color: $gold;
  letter-spacing: 4px;
  text-align: center;
}

.board-theme {
  font-size: clamp(8px, 1vw, 13px);
  color: $gold-muted;
  letter-spacing: 3px;
}

.board-legend { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 4px;
  transition: background $transition-fast;

  &.legend-active {
    background: rgba($gold, 0.1);
    outline: 1px solid rgba($gold, 0.3);
  }
}

.legend-dot   { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-name  { font-size: clamp(8px, 0.9vw, 12px); color: $ivory; }
.legend-coins { font-size: clamp(7px, 0.8vw, 11px); color: $gold; margin-left: 4px; }

/* ─── Клетки ─── */
.cell {
  position: relative;
  background: #111a11;
  border: 1px solid rgba($gold, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible;
  gap: 1px;
  padding: 2px;
  transition: background $transition-fast, box-shadow $transition-fast;

  &.type-go          { background: #1a1a0a; }
  &.type-jail        { background: #1a0a0a; }
  &.type-go_to_jail  { background: #1a0a0a; }
  &.type-free_parking{ background: #0a1a1a; }
  &.type-chance      { background: #0d0d1a; }
  &.type-treasury    { background: #0d1a0d; }

  // Моя фишка — золотой контур
  // Куплена — рамка цвета владельца
  &.cell-owned {
    border: 2px solid var(--oc);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 8px color-mix(in srgb, var(--oc) 40%, transparent);
  }

  &.cell-clickable {
    cursor: pointer;
    &:hover { background: rgba(255,255,255,0.06); }
  }

  // Моя фишка — золотой контур поверх
  &.cell-mine {
    outline: 2px solid $gold;
    outline-offset: -2px;
    background: rgba($gold, 0.06);
    z-index: 2;
  }

  // Текущий ход (другой игрок)
  &.cell-current {
    outline: 2px solid rgba(#4CAF50, 0.7);
    outline-offset: -2px;
  }

  // Анимация «только что пришёл»
  &.cell-just-moved {
    animation: cellLand 1.5s ease forwards;
  }
}

@keyframes cellLand {
  0%   { background: rgba($gold, 0.35); }
  40%  { background: rgba($gold, 0.2); }
  100% { background: rgba($gold, 0.06); }
}

/* Цветная полоска через border клетки */
.cell-bar { display: none; }

.side-bottom.cell { border-bottom: 12px solid var(--bar, transparent); }
.side-top.cell    { border-top:    12px solid var(--bar, transparent); }
.side-right.cell  { border-right:  12px solid var(--bar, transparent); }
.side-left.cell   { border-left:   12px solid var(--bar, transparent); }
.side-corner.cell { /* без полоски */ }

/* Индикатор владельца — квадратный флажок на внутренней стороне клетки */
.cell-owner {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--oc);
  // border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 2px 8px rgba(0,0,0,0.6);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: rgba(0,0,0,0.85);
  font-family: $font-sans;
}

/* Внутренняя сторона = сторона клетки, обращённая к центру доски */
/* Правая колонка → флажок слева */
.side-right .cell-owner {
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
  height: calc(100% - 1rem);
}
/* Левая колонка  → флажок справа */
.side-left  .cell-owner {
  right: 0;
  top: 50%;
  transform: translate(100%, -50%);
  height: calc(100% - 1rem);
}
/* Нижний ряд    → флажок сверху */
.side-bottom .cell-owner {
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  width: calc(100% - 1rem);
}
/* Верхний ряд   → флажок снизу */
.side-top    .cell-owner {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
  width: calc(100% - 1rem);
}
/* Угловые       → в центре */
.side-corner .cell-owner { top: 50%; left: 50%; transform: translate(-50%, -50%); width: 26px; height: 26px; font-size: 10px; }

.cell-name {
  font-size: clamp(7px, 0.7vw, 12px);
  color: #fff;
  text-align: center;
  line-height: 1.1;
  word-break: break-word;
  hyphens: auto;
  max-width: 100%;
  padding: 0 2px;
  font-weight: 700;
  text-transform: uppercase;
}
.side-corner .cell-name { font-size: clamp(8px, 0.9vw, 13px); color: $gold; }

.cell-type-icon { font-size: clamp(12px, 1.6vw, 22px); line-height: 1; }
.cell-price     { font-size: clamp(6px, 0.65vw, 9px); color: $gold; font-weight: 600; }

/* Дома / отель */
.cell-buildings { display: flex; gap: 1px; flex-wrap: wrap; justify-content: center; }
.house  { display: inline-block; width: 5px; height: 5px; background: $theme-football; border-radius: 1px; }
.hotel  { font-size: 6px; background: $theme-politics; color: white; padding: 1px 2px; border-radius: 1px; }

/* ─── Фишки ─── */
.cell-pieces {
  position: absolute;
  bottom: 2px;
  left: 2px;
  right: 2px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
}

.piece {
  width: clamp(14px, 1.8vw, 22px);
  height: clamp(14px, 1.8vw, 22px);
  border-radius: 50%;
  background: var(--pc, $gold);
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 2px 6px rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  position: relative;
  flex-shrink: 0;
  transition: transform $transition-fast;

  // Моя фишка — ярче, крупнее
  &.piece-me {
    border-color: white;
    border-width: 2.5px;
    box-shadow: 0 0 0 2px var(--pc, $gold), 0 3px 8px rgba(0,0,0,0.8);
    z-index: 3;
    animation: piecePulse 2s ease-in-out infinite;
  }

  // Текущий ход — зелёная обводка
  &.piece-current {
    box-shadow: 0 0 0 2px #fff, 0 0 10px rgba(255,255,255,0.5), 0 3px 8px rgba(0,0,0,0.8);
    animation: pieceBounce 0.6s ease;
  }
}

.piece-label {
  font-size: clamp(6px, 0.8vw, 12px);
  font-weight: 700;
  color: rgba(0,0,0,0.85);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

@keyframes piecePulse {
  0%, 100% { box-shadow: 0 0 0 2px var(--pc, $gold), 0 3px 8px rgba(0,0,0,0.8); }
  50%       { box-shadow: 0 0 0 4px var(--pc, $gold), 0 3px 12px rgba(0,0,0,0.9); }
}

@keyframes pieceBounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.4) translateY(-4px); }
  60%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
</style>
