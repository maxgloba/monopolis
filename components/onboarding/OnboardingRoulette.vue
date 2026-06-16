<script setup lang="ts">
const show    = ref(false)
const spinning = ref(false)
const done    = ref(false)
const prize   = 500

const SECTORS = [100, 150, 200, 250, 300, 500, 750, 1000]
const WIN_IDX = 5
const ARC     = (2 * Math.PI) / SECTORS.length

const canvasRef = ref<HTMLCanvasElement | null>(null)
let currentAngle = 0

onMounted(() => {
  if (localStorage.getItem('monopolis_roulette_shown')) return
  const delay = 5000 + Math.random() * 5000
  setTimeout(() => { show.value = true; nextTick(drawWheel) }, delay)
})

function drawWheel(angle = 0) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx  = canvas.getContext('2d')!
  const cx   = canvas.width / 2
  const cy   = canvas.height / 2
  const r    = cx - 10
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  SECTORS.forEach((val, i) => {
    const start = angle + i * ARC - Math.PI / 2
    const end   = start + ARC

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = i % 2 === 0 ? '#161410' : '#2A2218'
    ctx.fill()
    ctx.strokeStyle = '#D4A017'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(start + ARC / 2)
    ctx.textAlign = 'right'
    ctx.fillStyle = '#D4A017'
    ctx.font = `bold 14px "Playfair Display", serif`
    ctx.fillText(String(val), r - 12, 5)
    ctx.restore()
  })

  ctx.beginPath()
  ctx.moveTo(cx - 10, 8)
  ctx.lineTo(cx + 10, 8)
  ctx.lineTo(cx, 30)
  ctx.closePath()
  ctx.fillStyle = '#D4A017'
  ctx.fill()
}

function spin() {
  spinning.value = true
  const extraSpins  = 4 + Math.random()
  const targetAngle = extraSpins * 2 * Math.PI + (2 * Math.PI - WIN_IDX * ARC - ARC / 2) - Math.PI / 2
  const duration    = 4000
  const start       = performance.now()
  const startAngle  = currentAngle

  function animate(now: number) {
    const elapsed  = now - start
    const progress = Math.min(elapsed / duration, 1)
    const ease     = 1 - Math.pow(1 - progress, 4)
    currentAngle   = startAngle + targetAngle * ease
    drawWheel(currentAngle)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      spinning.value = false
      done.value = true
      localStorage.setItem('monopolis_roulette_shown', '1')
    }
  }
  requestAnimationFrame(animate)
}

function close() {
  show.value = false
  localStorage.setItem('monopolis_roulette_shown', '1')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="roulette-overlay" @click.self="close">
        <div class="roulette-card">
          <button class="roulette-x" @click="close">✕</button>

          <div v-if="!done">
            <h2 class="roulette-title">Испытай удачу!</h2>
            <p class="roulette-sub">Крути рулетку — получи монеты</p>
            <canvas ref="canvasRef" width="300" height="300" class="roulette-canvas" />
            <UiButton :full="true" :disabled="spinning" @click="spin">
              {{ spinning ? 'Вращается...' : 'Крутить' }}
            </UiButton>
          </div>

          <div v-else class="roulette-result">
            <div class="roulette-coin">🪙</div>
            <h2 class="roulette-title">Ты выиграл {{ prize }} монет!</h2>
            <p class="roulette-sub">Зарегистрируйся — и монеты зачислятся на твой аккаунт</p>
            <div class="roulette-btns">
              <NuxtLink :to="`/register?bonus=${prize}`">
                <UiButton :full="true">Зарегистрироваться →</UiButton>
              </NuxtLink>
              <UiButton variant="ghost" :full="true" @click="close">Позже</UiButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.roulette-overlay {
  position: fixed;
  inset: 0;
  background: rgba($noir, 0.85);
  backdrop-filter: blur(4px);
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.roulette-card {
  position: relative;
  background: $noir-card;
  border: 1px solid $gold-faint;
  border-radius: $radius-card;
  padding: 32px 28px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $gold, transparent);
  }
}

.roulette-x {
  position: absolute;
  top: 12px; right: 12px;
  background: none; border: none;
  color: $ivory-faint; font-size: 16px; cursor: pointer;
  &:hover { color: $gold; }
}

.roulette-title {
  font-family: $font-serif;
  font-size: 20px;
  color: $gold;
  letter-spacing: 2px;
  text-align: center;
}

.roulette-sub {
  font-size: 13px;
  color: $ivory-muted;
  text-align: center;
  letter-spacing: 1px;
}

.roulette-canvas {
  border-radius: 50%;
  border: 2px solid $gold-faint;
}

.roulette-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.roulette-coin {
  font-size: 48px;
}

.roulette-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.modal-enter-active, .modal-leave-active { transition: opacity 200ms ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
