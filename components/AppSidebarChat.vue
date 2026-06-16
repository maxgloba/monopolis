<script setup lang="ts">
export interface ChatMessage {
  type?: 'user' | 'system'
  userId?: number
  nickname?: string
  message?: string
  text?: string
  icon?: string
  time: string
}

const props = defineProps<{
  messages: ChatMessage[]
  myUserId?: number | null
  emptyText?: string
}>()

const emit = defineEmits<{
  send: [message: string]
  'avatar-click': [{ nickname: string; userId: number; x: number; y: number }]
}>()

const chatInput  = ref('')
const chatRef    = ref<HTMLElement | null>(null)

watch(() => props.messages.length, async () => {
  await nextTick()
  if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
}, { immediate: true })

function send() {
  if (!chatInput.value.trim()) return
  emit('send', chatInput.value.trim())
  chatInput.value = ''
}

function onAvatarClick(msg: ChatMessage, e: MouseEvent) {
  if (!msg.userId || !msg.nickname) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  emit('avatar-click', { nickname: msg.nickname, userId: msg.userId, x: rect.left, y: rect.top })
}
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 gap-2">
    <div ref="chatRef" class="chat-messages flex-1 overflow-y-auto flex flex-col gap-[10px] py-1 px-0.5 min-h-0">
      <div v-if="!messages.length" class="text-ivory-faint text-[12px] text-center pt-4">{{ emptyText ?? 'Пока нет сообщений' }}</div>
      <template v-for="(msg, i) in messages" :key="i">
        <!-- Системное -->
        <div v-if="msg.type === 'system'" class="flex items-center gap-[5px] self-center bg-white/5 rounded-[20px] px-[10px] py-1 max-w-[92%]">
          <span v-if="msg.icon" class="text-[12px] shrink-0">{{ msg.icon }}</span>
          <span class="text-[11px] text-ivory-muted flex-1 leading-[1.4]">{{ msg.text }}</span>
          <span v-if="msg.time" class="text-[9px] text-ivory-faint shrink-0">{{ msg.time }}</span>
        </div>
        <!-- Обычное -->
        <div
          v-else
          class="flex items-start gap-[6px]"
          :class="{ 'flex-row-reverse': msg.userId === myUserId }"
        >
          <template v-if="msg.userId !== myUserId">
            <button
              class="w-[26px] h-[26px] rounded-full bg-gold-muted border-0 text-noir text-[11px] font-bold font-sans cursor-pointer shrink-0 flex items-center justify-center hover:bg-gold"
              @click="onAvatarClick(msg, $event)"
            >
              {{ msg.nickname?.slice(0, 1).toUpperCase() }}
            </button>
            <div class="chat-bubble-other max-w-[78%] flex flex-col gap-0.5">
              <div class="text-[10px] text-gold tracking-[0.5px] mb-0.5">{{ msg.nickname }}</div>
              <div class="text-[13px] text-ivory leading-[1.4] break-words">{{ msg.message }}</div>
              <div class="text-[9px] text-ivory-faint self-end mt-0.5">{{ msg.time }}</div>
            </div>
          </template>
          <template v-else>
            <div class="chat-bubble-mine max-w-[78%] flex flex-col gap-0.5 items-end">
              <div class="text-[13px] text-ivory leading-[1.4] break-words">{{ msg.message }}</div>
              <div class="text-[9px] text-ivory-faint self-end mt-0.5">{{ msg.time }}</div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div class="shrink-0 pt-2 border-t border-noir-border">
      <div class="flex gap-[6px] items-center">
        <input
          v-model="chatInput"
          class="chat-input flex-1 bg-[#1a1a16] border border-noir-border rounded-[20px] text-ivory font-sans text-[13px] px-[14px] py-2 outline-none transition-all duration-[150ms] placeholder:text-ivory-faint focus:border-gold/40"
          placeholder="Сообщение..."
          maxlength="200"
          @keyup.enter="send"
        />
        <button
          class="w-[34px] h-[34px] bg-gold text-noir border-0 rounded-full text-[16px] cursor-pointer flex items-center justify-center shrink-0 font-bold transition-all duration-[150ms] hover:bg-gold-light hover:scale-[1.08]"
          @click="send"
        >↑</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: theme('colors.noir.border'); border-radius: 2px; }

.chat-bubble-other {
  background: #1e2a1e;
  border: 1px solid rgba(var(--color-gold), 0.12);
  border-radius: 2px 12px 12px 12px;
  padding: 7px 10px 5px;
}

.chat-bubble-mine {
  background: #1a2d3a;
  border: 1px solid rgba(33, 150, 243, 0.25);
  border-radius: 12px 2px 12px 12px;
  padding: 7px 10px 5px;
}
</style>
