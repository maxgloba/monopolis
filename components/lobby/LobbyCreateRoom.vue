<script setup lang="ts">
const emit = defineEmits<{ close: []; created: [id: number] }>()

const roomStore = useRoomStore()
const { error: toastError } = useToast()
const router = useRouter()

const form = reactive({
  theme:         'football' as 'football' | 'hockey' | 'empire' | 'politics',
  gameType:      'virtual' as 'virtual' | 'real_money',
  betAmount:     100,
  isPrivate:     false,
  botDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
  maxPlayers:    4,
})
const loading = ref(false)

const themes = [
  { value: 'football', label: 'Футбол',  img: '/banners/football.png' },
  { value: 'hockey',   label: 'Хоккей',  img: '/banners/hockey.png'   },
  { value: 'empire',   label: 'Империя', img: '/banners/empire.png'   },
  { value: 'politics', label: 'Политика',img: '/banners/russia.png'   },
]

async function submit() {
  loading.value = true
  try {
    const { id } = await roomStore.createRoom({
      theme:         form.theme,
      gameType:      form.gameType,
      betAmount:     form.gameType === 'real_money' ? form.betAmount : undefined,
      isPrivate:     form.isPrivate,
      botDifficulty: form.botDifficulty,
      maxPlayers:    form.maxPlayers,
    })
    emit('created', id)
    router.push(`/room/${id}`)
  } catch (e: any) {
    toastError(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UiModal :model-value="true" title="Создать комнату" size="md" @update:model-value="emit('close')">
    <form class="flex flex-col gap-5" @submit.prevent="submit">
      <div class="flex flex-col gap-2">
        <p class="font-sans text-[10px] tracking-[3px] uppercase text-gold-muted">Тема игры</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="t in themes" :key="t.value"
            type="button"
            class="relative cursor-pointer transition-all duration-[150ms] group rounded-2xl overflow-hidden"
            :class="form.theme === t.value ? 'border-gold ring-1 ring-gold' : 'border-noir-border hover:border-gold/60'"
            @click="form.theme = t.value as any"
          >
            <img :src="t.img" :alt="t.label" class="w-full h-auto" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div class="absolute bottom-2 left-0 right-0 text-center text-lg font-serif tracking-[1px]"
              :class="form.theme === t.value ? 'text-gold' : 'text-ivory-muted group-hover:text-gold'">
              {{ t.label }}
            </div>
            <div v-if="form.theme === t.value" class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-black" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="font-sans text-[10px] tracking-[3px] uppercase text-gold-muted">Тип игры</p>
        <div class="flex gap-1.5 flex-wrap">
          <button type="button" class="px-3.5 py-2 bg-noir-surface border border-noir-border rounded-imperial text-ivory-muted text-xs tracking-[1px] cursor-pointer transition-all duration-[150ms] hover:border-gold hover:text-gold hover:bg-gold/5" :class="{ 'border-gold text-gold bg-gold/5': form.gameType === 'virtual' }" @click="form.gameType = 'virtual'">🪙 Монеты</button>
          <button type="button" class="px-3.5 py-2 bg-noir-surface border border-noir-border rounded-imperial text-ivory-muted text-xs tracking-[1px] cursor-pointer transition-all duration-[150ms] hover:border-gold hover:text-gold hover:bg-gold/5" :class="{ 'border-gold text-gold bg-gold/5': form.gameType === 'real_money' }" @click="form.gameType = 'real_money'">💳 Real Money</button>
        </div>
      </div>

      <UiInput
        v-if="form.gameType === 'real_money'"
        v-model.number="form.betAmount"
        type="text"
        label="Взнос"
        suffix="₽"
        hint="от 50 до 5000 ₽"
      />

      <div class="flex gap-4">
        <div class="flex flex-col gap-2">
          <p class="font-sans text-[10px] tracking-[3px] uppercase text-gold-muted">Игроков</p>
          <div class="flex gap-1.5 flex-wrap">
            <button v-for="n in [2,3,4]" :key="n" type="button" class="px-3.5 py-2 bg-noir-surface border border-noir-border rounded-imperial text-ivory-muted text-xs tracking-[1px] cursor-pointer transition-all duration-[150ms] hover:border-gold hover:text-gold hover:bg-gold/5" :class="{ 'border-gold text-gold bg-gold/5': form.maxPlayers === n }" @click="form.maxPlayers = n">{{ n }}</button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-sans text-[10px] tracking-[3px] uppercase text-gold-muted">Сложность ботов</p>
          <div class="flex gap-1.5 flex-wrap">
            <button v-for="d in ['easy','medium','hard']" :key="d" type="button" class="px-3.5 py-2 bg-noir-surface border border-noir-border rounded-imperial text-ivory-muted text-xs tracking-[1px] cursor-pointer transition-all duration-[150ms] hover:border-gold hover:text-gold hover:bg-gold/5" :class="{ 'border-gold text-gold bg-gold/5': form.botDifficulty === d }" @click="form.botDifficulty = d as any">{{ d }}</button>
          </div>
        </div>
      </div>

      <label class="flex items-center gap-2.5 text-[13px] text-ivory-muted cursor-pointer">
        <input v-model="form.isPrivate" type="checkbox" class="accent-gold w-4 h-4" />
        <span>Приватная комната (по коду)</span>
      </label>
    </form>
    <template #footer>
      <UiButton variant="ghost" @click="emit('close')">Отмена</UiButton>
      <UiButton :loading="loading" @click="submit">Создать</UiButton>
    </template>
  </UiModal>
</template>
