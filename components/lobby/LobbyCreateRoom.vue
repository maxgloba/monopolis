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
  { value: 'football', label: '⚽ Футбол' },
  { value: 'hockey',   label: '🏒 Хоккей' },
  { value: 'empire',   label: '👑 Империя' },
  { value: 'politics', label: '🏛️ Политика' },
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
        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="t in themes" :key="t.value"
            type="button"
            class="px-3.5 py-2 bg-noir-surface border border-noir-border rounded-imperial text-ivory-muted text-xs tracking-[1px] cursor-pointer transition-all duration-[150ms] hover:border-gold hover:text-gold hover:bg-gold/5"
            :class="{ 'border-gold text-gold bg-gold/5': form.theme === t.value }"
            @click="form.theme = t.value as any"
          >{{ t.label }}</button>
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
