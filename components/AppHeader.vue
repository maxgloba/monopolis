<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const auth = useAuthStore()

const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function closeMenu() {
  menuOpen.value = false
}

const navLinks = [
  { label: 'Правила',   to: '/rules'    },
  { label: 'О нас',     to: '/about'    },
  { label: 'Контакты',  to: '/contacts' },
]
</script>

<template>
  <header
    class="sticky top-0 z-[100] w-full bg-transparent transition-all duration-[250ms]"
    :class="scrolled ? 'bg-noir-surface/[0.92] backdrop-blur-[12px] shadow-dark' : ''"
  >
    <div class="w-full px-10 h-[72px] flex items-center gap-10">

      <!-- Logo -->
      <NuxtLink
        to="/"
        class="font-serif text-heading font-bold tracking-[4px] text-gold no-underline flex-shrink-0 transition-all duration-[150ms] hover:text-gold-light"
        @click="closeMenu"
      >
        МОНОПОЛИС
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6 flex-1" aria-label="Основная навигация">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link font-sans text-body font-normal tracking-[1px] text-ivory no-underline relative transition-all duration-[150ms] hover:text-gold"
          active-class="nav-link--active"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Desktop actions -->
      <div class="hidden md:flex items-center gap-4 ml-auto">
        <template v-if="auth.isAuthenticated && auth.user">
          <div class="flex items-center gap-2">
            <UiAvatar
              :src="auth.user.avatarUrl"
              :name="auth.user.nickname"
              size="sm"
            />
            <span class="font-sans text-body text-ivory-muted tracking-[0.5px] max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{{ auth.user.nickname }}</span>
          </div>
          <NuxtLink to="/lobby">
            <UiButton variant="primary" size="sm">В лобби</UiButton>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login">
            <UiButton variant="ghost" size="sm">Войти</UiButton>
          </NuxtLink>
          <NuxtLink to="/register">
            <UiButton variant="primary" size="sm">Играть</UiButton>
          </NuxtLink>
        </template>
      </div>

      <!-- Hamburger -->
      <button
        class="burger md:hidden flex-col justify-center gap-[5px] w-9 h-9 p-1 bg-transparent border border-noir-border rounded-imperial cursor-pointer ml-auto transition-all duration-[150ms] hover:border-gold-muted"
        :class="menuOpen ? 'burger--open flex' : 'flex'"
        aria-label="Открыть меню"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <span class="burger-line block w-full h-px bg-ivory-muted transition-all duration-[150ms]" />
        <span class="burger-line block w-full h-px bg-ivory-muted transition-all duration-[150ms]" />
        <span class="burger-line block w-full h-px bg-ivory-muted transition-all duration-[150ms]" />
      </button>

    </div>

    <!-- Mobile dropdown -->
    <Transition name="mobile-menu">
      <div
        v-if="menuOpen"
        class="md:hidden flex flex-col gap-6 px-10 pt-6 pb-10 bg-noir-surface/[0.98] backdrop-blur-[12px] border-t border-noir-border"
      >
        <nav class="flex flex-col gap-4" aria-label="Мобильная навигация">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-sans text-subhead font-normal text-ivory no-underline py-1 border-b border-noir-border transition-all duration-[150ms] hover:text-gold"
            active-class="mobile-link--active"
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex flex-col gap-2">
          <template v-if="auth.isAuthenticated && auth.user">
            <div class="flex items-center gap-2">
              <UiAvatar
                :src="auth.user.avatarUrl"
                :name="auth.user.nickname"
                size="sm"
              />
              <span class="font-sans text-body text-ivory-muted tracking-[0.5px] max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{{ auth.user.nickname }}</span>
            </div>
            <NuxtLink to="/lobby" @click="closeMenu">
              <UiButton variant="primary" size="sm" full>В лобби</UiButton>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" @click="closeMenu">
              <UiButton variant="ghost" size="sm" full>Войти</UiButton>
            </NuxtLink>
            <NuxtLink to="/register" @click="closeMenu">
              <UiButton variant="primary" size="sm" full>Играть</UiButton>
            </NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 1px;
  background: theme('colors.gold.DEFAULT');
  transition: width 250ms;
}

.nav-link:hover::after,
.nav-link--active::after {
  width: 100%;
}

.nav-link--active {
  color: theme('colors.gold.DEFAULT');
}

.mobile-link--active {
  color: theme('colors.gold.DEFAULT');
}

.burger--open .burger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.burger--open .burger-line:nth-child(2) {
  opacity: 0;
}
.burger--open .burger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 250ms, transform 250ms;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
