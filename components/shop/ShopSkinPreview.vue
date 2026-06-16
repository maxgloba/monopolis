<script setup lang="ts">
const props = defineProps<{
  src: string | null
  name: string
  type: string
}>()

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const isGif = computed(() => props.src?.endsWith('.gif') ?? false)
</script>

<template>
  <div class="preview">
    <img v-if="src" :src="src" :alt="name" class="preview-img" :class="{ 'preview-img--gif': isGif }" />
    <div v-else class="preview-placeholder">
      {{ getInitials(name) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview {
  width: 100%;
  aspect-ratio: 1;
  background: $noir-surface;
  border-radius: $radius-sharp;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform $transition-fast;

  &:hover {
    animation: pulse 1s ease infinite;
  }
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  font-family: $font-serif;
  font-size: 28px;
  color: $gold;
  letter-spacing: 2px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
