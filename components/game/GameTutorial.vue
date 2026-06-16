<script setup lang="ts">
const props = defineProps<{ gameCount: number }>()
const emit = defineEmits<{ done: [] }>()

const STORAGE_KEY = 'monopolis_tutorial_done'

const visible = ref(false)
const step = ref(0)

const steps = [
  { title: 'Ваша фишка', text: 'Это ваша фишка — нажмите на неё чтобы посмотреть персонажа' },
  { title: 'Ваш ход', text: 'Ваш ход — нажмите «Бросить кубики»' },
  { title: 'Покупка', text: 'Вы попали на свободную собственность — купить или отказаться?' },
  { title: 'Аренда', text: 'Когда соперник попадает на вашу клетку, вы получаете монеты' },
  { title: 'Дома', text: 'Стройте дома при монополии — это увеличивает аренду' },
  { title: 'Победа', text: 'Последний оставшийся игрок побеждает!' },
]

onMounted(() => {
  if (props.gameCount === 1 && !localStorage.getItem(STORAGE_KEY)) {
    visible.value = true
  }
})

function next() {
  if (step.value < steps.length - 1) {
    step.value++
  } else {
    finish()
  }
}

function finish() {
  localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
  emit('done')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="tutorial">
      <div
        v-if="visible"
        class="fixed inset-0 bg-noir/70 backdrop-blur-sm z-[150] flex items-end sm:items-center justify-center p-6"
      >
        <div class="tutorial-box bg-noir-card border border-noir-border rounded-card p-7 w-full max-w-[440px] relative">
          <div class="flex gap-[6px] mb-5">
            <div
              v-for="(_, i) in steps"
              :key="i"
              class="h-[6px] rounded-full bg-noir-border transition-all duration-[150ms]"
              :class="{
                'bg-gold w-[18px] rounded-[3px]': i === step,
                'bg-gold-muted w-[6px]': i < step,
                'w-[6px]': i > step,
              }"
            />
          </div>

          <div class="mb-6">
            <div class="text-[10px] tracking-[2px] uppercase text-gold-muted mb-2">{{ step + 1 }} / {{ steps.length }}</div>
            <h3 class="font-serif text-[18px] text-gold mb-[10px]">{{ steps[step].title }}</h3>
            <p class="text-[14px] text-ivory-muted leading-relaxed">{{ steps[step].text }}</p>
          </div>

          <div class="flex items-center justify-between gap-3">
            <button
              class="bg-transparent border-none text-ivory-faint text-label tracking-[1px] cursor-pointer py-2 px-0 hover:text-ivory-muted transition-all duration-[150ms]"
              @click="finish"
            >Пропустить туториал</button>
            <button
              class="inline-flex items-center px-7 py-3 bg-gradient-to-br from-gold to-gold-dark text-noir border-none rounded-imperial text-label font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-[150ms] hover:opacity-90 active:scale-[0.98]"
              @click="next"
            >
              {{ step < steps.length - 1 ? 'Далее' : 'Начать игру' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tutorial-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
}

.tutorial-enter-active,
.tutorial-leave-active {
  transition: opacity 250ms ease;
}
.tutorial-enter-from,
.tutorial-leave-to {
  opacity: 0;
}
</style>
