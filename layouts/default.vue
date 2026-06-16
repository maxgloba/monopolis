<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-noir text-ivory flex flex-col">
    <AppHeader />
    <slot />
    <UiToast />
    <OnboardingRoulette v-if="!authStore.isAuthenticated" />
  </div>
</template>
