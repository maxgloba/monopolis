<script setup lang="ts">
const props = defineProps<{
  question: {
    questionId: number
    text: string
    options: string[]
    reward: number
    penalty: number
    timeLimit?: number
  }
}>()

const emit = defineEmits<{
  answer: [questionId: number, answerIdx: number]
}>()

const selected  = ref<number | null>(null)
const timeLeft  = ref(props.question.timeLimit ?? 90)
const timerDone = ref(false)

let countdown: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  countdown = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(countdown!)
      timerDone.value = true
    }
  }, 1000)
})

onUnmounted(() => {
  if (countdown) clearInterval(countdown)
})

function pick(idx: number) {
  if (selected.value !== null || timerDone.value) return
  selected.value = idx
  if (countdown) clearInterval(countdown)
  emit('answer', props.question.questionId, idx)
}

const timerPct = computed(() => (timeLeft.value / (props.question.timeLimit ?? 90)) * 100)
const timerColor = computed(() => timeLeft.value > 30 ? '#4CAF50' : timeLeft.value > 10 ? '#FF9800' : '#F44336')
</script>

<template>
  <div class="w-[380px] bg-noir-card border border-gold rounded-card p-6 flex flex-col gap-4 shadow-gold">
    <div class="flex items-center gap-[10px]">
      <span class="text-2xl">❓</span>
      <span class="text-label tracking-[3px] text-gold font-semibold">ВОПРОС</span>
    </div>
    <div class="h-1 bg-white/[0.08] rounded-[2px] overflow-hidden">
      <div class="h-full rounded-[2px] transition-[width] duration-1000 ease-linear" :style="{ width: timerPct + '%', background: timerColor, transition: 'width 1s linear, background 0.5s' }"></div>
    </div>
    <div class="text-label tracking-[1px] text-right transition-colors duration-500" :style="{ color: timerColor }">{{ timeLeft }} сек</div>
    <div class="flex gap-4 text-label">
      <span class="text-theme-football">+{{ question.reward }} монет за правильный</span>
      <span class="text-theme-politics">−{{ question.penalty }} за неправильный</span>
    </div>
    <p class="text-[16px] text-ivory leading-[1.5] m-0 font-serif">{{ question.text }}</p>
    <div class="flex flex-col gap-2">
      <button
        v-for="(opt, i) in question.options"
        :key="i"
        class="flex items-center gap-3 py-[10px] px-[14px] bg-noir border border-noir-border rounded-imperial cursor-pointer text-left transition-all duration-[150ms] text-ivory hover:border-gold hover:bg-gold/[0.07]"
        :class="{
          'border-gold bg-gold/[0.12] hover:bg-gold/[0.12]': selected === i,
          'opacity-35 cursor-default pointer-events-none': selected !== null && selected !== i
        }"
        @click="pick(i)"
      >
        <span class="w-6 h-6 rounded-full bg-noir-border flex items-center justify-center text-label font-bold text-gold shrink-0">{{ ['A','B','C','D'][i] }}</span>
        <span class="text-[13px]">{{ opt }}</span>
      </button>
    </div>
    <div v-if="selected !== null" class="text-label text-ivory-faint text-center tracking-[1px]">Ожидаем результат…</div>
  </div>
</template>
