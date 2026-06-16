<template>
  <div class="w-screen h-screen overflow-hidden bg-noir text-ivory relative flex flex-col">
    <AppHeader />
    <div class="flex-1 min-h-0 overflow-hidden">
      <slot />
    </div>
    <UiToast />
  </div>
</template>
