<script setup lang="ts">
const props = defineProps<{
  dice: [number, number] | null
  rolling: boolean
}>()

const DOT_POSITIONS: Record<number, string[]> = {
  1: ['mc'],
  2: ['tr', 'bl'],
  3: ['tr', 'mc', 'bl'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'mc', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
}

// Face rotations to show face N to viewer
const FACE_RX: Record<number, number> = { 1: 0, 2: 90, 3: 0, 4: 0, 5: -90, 6: 0 }
const FACE_RY: Record<number, number> = { 1: 0, 2: 0, 3: -90, 4: 90, 5: 0, 6: 180 }

const FACES = [
  { cls: 'face-front',  val: 1 },
  { cls: 'face-back',   val: 6 },
  { cls: 'face-right',  val: 3 },
  { cls: 'face-left',   val: 4 },
  { cls: 'face-top',    val: 2 },
  { cls: 'face-bottom', val: 5 },
]

function dieVars(idx: number): Record<string, string> {
  const val = props.dice?.[idx] ?? 1
  return {
    '--rx': FACE_RX[val] + 'deg',
    '--ry': FACE_RY[val] + 'deg',
  }
}
</script>

<template>
  <div class="dice-tray">
    <div
      v-for="(_, idx) in [0, 1]"
      :key="idx"
      class="die-scene"
      :class="`die-${idx}`"
    >
      <div
        class="die-cube"
        :class="{ rolling }"
        :style="dieVars(idx)"
      >
        <div v-for="face in FACES" :key="face.cls" class="face" :class="face.cls">
          <span
            v-for="pos in DOT_POSITIONS[face.val]"
            :key="pos"
            class="dot"
            :class="`dot-${pos}`"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dice-tray {
  display: flex;
  gap: 18px;
  justify-content: center;
  align-items: center;
}

.die-scene {
  width: 50px;
  height: 50px;
  perspective: 200px;
}

.die-cube {
  width: 50px;
  height: 50px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 300ms ease-out;

  &.rolling {
    animation: diceThrow 2000ms cubic-bezier(.2,.6,.4,1) forwards;
  }

  &.rolling.die-1 {
    animation-delay: 80ms;
  }
}

.face {
  position: absolute;
  width: 50px;
  height: 50px;
  background: $ivory;
  border-radius: 8px;
  border: 1px solid rgba($noir, 0.12);
  box-shadow:
    inset -2px -2px 5px rgba(0,0,0,0.18),
    inset 1px 1px 3px rgba(255,255,255,0.7);

  &.face-front  { transform: translateZ(25px); }
  &.face-back   { transform: rotateY(180deg) translateZ(25px); }
  &.face-right  { transform: rotateY(90deg) translateZ(25px); }
  &.face-left   { transform: rotateY(-90deg) translateZ(25px); }
  &.face-top    { transform: rotateX(-90deg) translateZ(25px); }
  &.face-bottom { transform: rotateX(90deg) translateZ(25px); }
}

.dot {
  position: absolute;
  width: 9px;
  height: 9px;
  background: $noir;
  border-radius: 50%;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);

  &-tl { top: 8px;  left: 8px; }
  &-tc { top: 8px;  left: 50%; transform: translateX(-50%); }
  &-tr { top: 8px;  right: 8px; }

  &-ml { top: 50%;  left: 8px;  transform: translateY(-50%); }
  &-mc { top: 50%;  left: 50%;  transform: translate(-50%, -50%); }
  &-mr { top: 50%;  right: 8px; transform: translateY(-50%); }

  &-bl { bottom: 8px; left: 8px; }
  &-bc { bottom: 8px; left: 50%; transform: translateX(-50%); }
  &-br { bottom: 8px; right: 8px; }
}

@keyframes diceThrow {
  0%   { transform: rotateX(0deg)    rotateY(0deg)    rotateZ(0deg); }
  10%  { transform: rotateX(-120deg) rotateY(80deg)   rotateZ(45deg); }
  25%  { transform: rotateX(-300deg) rotateY(200deg)  rotateZ(90deg); }
  40%  { transform: rotateX(-500deg) rotateY(350deg)  rotateZ(150deg); }
  55%  { transform: rotateX(-680deg) rotateY(470deg)  rotateZ(200deg); }
  70%  { transform: rotateX(-840deg) rotateY(570deg)  rotateZ(235deg); }
  82%  { transform: rotateX(-960deg) rotateY(640deg)  rotateZ(255deg); }
  91%  { transform: rotateX(calc(var(--rx) - 1080deg + 12deg)) rotateY(calc(var(--ry) - 1080deg + 8deg)) rotateZ(4deg); }
  97%  { transform: rotateX(calc(var(--rx) - 1080deg - 3deg))  rotateY(calc(var(--ry) - 1080deg - 2deg)) rotateZ(-1deg); }
  100% { transform: rotateX(calc(var(--rx) - 1080deg))         rotateY(calc(var(--ry) - 1080deg))         rotateZ(0deg); }
}
</style>
