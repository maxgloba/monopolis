<script setup lang="ts">
definePageMeta({ layout: 'default' })

const authStore = useAuthStore()
</script>

<template>
  <div class="main-screen min-h-screen bg-noir text-ivory">

    <!-- HERO -->
    <section class="hero relative flex flex-col items-center justify-center text-center px-6 pt-12 pb-12 overflow-hidden">
      <img class="w-[500px]" src="/logo-bg.png" />

      <h1 class="font-serif text-6xl md:text-7xl text-gold mb-6 tracking-widest leading-tight">
        МОНОПОЛИС
      </h1>

      <p class="text-ivory-muted text-lg max-w-xl mb-8">
        Классическая настолка Монополия в российском антураже. Четыре уникальных поля, реальные ставки,
        мультиплеер до 4 игроков и боты с интеллектом.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <NuxtLink v-if="!authStore.isAuthenticated" to="/register">
          <UiButton size="lg" variant="primary">Начать играть</UiButton>
        </NuxtLink>
        <NuxtLink v-else to="/lobby">
          <UiButton size="lg" variant="primary">В лобби</UiButton>
        </NuxtLink>
        <NuxtLink to="/rules">
          <UiButton size="lg" variant="ghost">Правила игры</UiButton>
        </NuxtLink>
      </div>

      <!-- золотая линия-разделитель -->
      <div class="mt-20 w-full max-w-2xl h-px bg-gold-divider opacity-40" />
    </section>

    <!-- ТЕМЫ ПОЛЕЙ -->
    <section class="py-16">
      <div class="container-fluid">
        <p class="text-label text-gold-muted tracking-[4px] text-center mb-3">ВЫБЕРИ ТЕМУ</p>
        <h2 class="font-serif text-4xl text-gold text-center mb-12 tracking-wide">Четыре игровых поля</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="theme in themes" :key="theme.value"
            class="relative flex flex-col items-center text-center"
          >
            <div class="absolute top-0 left-0 right-0 h-px z-10" :class="theme.line" />
            <img
              :src="theme.banner"
              :alt="theme.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-3xl"
            />
            <div class="p-4 rounded-2xl bg-noir-surface/90 mt-2">
              <h3 class="font-serif text-2xl text-gold mt-0">{{ theme.name }}</h3>
              <p class="text-ivory-muted text-sm leading-relaxed mb-0">{{ theme.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ФИЧИ -->
    <section class="bg-noir-surface py-16">
      <div class="max-w-5xl mx-auto px-6">
        <p class="text-label text-gold-muted tracking-[4px] text-center mb-3">ВОЗМОЖНОСТИ</p>
        <h2 class="font-serif text-3xl text-gold text-center mb-12 tracking-wide">Почему Монополис</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feat in features" :key="feat.title" class="flex gap-4 p-6 bg-noir-card border border-noir-border rounded-card hover:border-gold/30 transition-colors duration-200">
            <span class="text-2xl text-gold shrink-0 w-8 text-center"><i :class="feat.icon"></i></span>
            <div>
              <h4 class="text-ivory font-medium mb-1">{{ feat.title }}</h4>
              <p class="text-ivory-muted text-sm leading-relaxed">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- КАК ИГРАТЬ -->
    <section class="max-w-4xl mx-auto px-6 py-16">
      <p class="text-label text-gold-muted tracking-[4px] text-center mb-3">ПРОСТО И БЫСТРО</p>
      <h2 class="font-serif text-3xl text-gold text-center mb-12 tracking-wide">Как начать</h2>

      <div class="flex flex-col md:flex-row gap-0 md:gap-0 items-stretch">
        <div v-for="(step, i) in steps" :key="i" class="flex-1 flex flex-col items-center text-center px-6 py-8 relative">
          <div class="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold font-serif text-xl mb-4 shrink-0">
            {{ i + 1 }}
          </div>
          <h4 class="text-ivory font-medium mb-2">{{ step.title }}</h4>
          <p class="text-ivory-muted text-sm leading-relaxed">{{ step.desc }}</p>
          <div v-if="i < steps.length - 1" class="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-gold-muted text-xl">›</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 px-6 text-center bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(212,160,23,0.05),transparent)]">
      <h2 class="font-serif text-4xl text-gold mb-4 tracking-wide">Готов бросить кубики?</h2>
      <p class="text-ivory-muted mb-8 text-lg">Регистрация бесплатна. 500 монет в подарок.</p>
      <NuxtLink v-if="!authStore.isAuthenticated" to="/register">
        <UiButton size="lg" variant="primary">Создать аккаунт</UiButton>
      </NuxtLink>
      <NuxtLink v-else to="/lobby">
        <UiButton size="lg" variant="primary">Перейти в лобби</UiButton>
      </NuxtLink>
    </section>

  </div>
</template>

<script lang="ts">
const themes = [
  { value: 'football', icon: '⚽', name: 'Футбол',  banner: '/banners/football.png', line: 'bg-gradient-to-r from-transparent via-theme-football to-transparent', desc: 'Звёзды российского футбола: Дзюба, Аршавин, Сычёв и другие легенды.' },
  { value: 'hockey',   icon: '🏒', name: 'Хоккей',  banner: '/banners/hockey.png',   line: 'bg-gradient-to-r from-transparent via-theme-hockey to-transparent',   desc: 'Овечкин, Малкин, Дацюк, Капризов — лучшие хоккеисты страны.' },
  { value: 'empire',   icon: '👑', name: 'Империя', banner: '/banners/empire.png',   line: 'bg-gradient-to-r from-transparent via-theme-empire to-transparent',   desc: 'Исторические фигуры и символы Российской империи.' },
  { value: 'politics', icon: '🏛️', name: 'Политика', banner: '/banners/russia.png', line: 'bg-gradient-to-r from-transparent via-theme-politics to-transparent', desc: 'Политические деятели и ключевые события современной России.' },
]

const features = [
  { icon: 'fa-solid fa-users',          title: 'Мультиплеер',      desc: 'До 4 игроков в одной комнате. Играй с друзьями или незнакомцами.' },
  { icon: 'fa-solid fa-robot',          title: 'Боты с ИИ',        desc: 'Три уровня сложности: лёгкий, средний, сложный. Всегда есть с кем сыграть.' },
  { icon: 'fa-solid fa-coins',          title: 'Реальные ставки',  desc: 'Играй на виртуальные монеты или ставь реальные рубли через ЮКассу.' },
  { icon: 'fa-solid fa-trophy',         title: 'Рейтинг',          desc: 'Глобальная таблица лидеров. Поднимайся выше с каждой победой.' },
  { icon: 'fa-solid fa-palette',        title: 'Кастомизация',     desc: 'Магазин скинов: уникальные фишки, рамки профиля и анимации победы.' },
  { icon: 'fa-solid fa-bolt',           title: 'Реалтайм',         desc: 'Socket.IO — мгновенная синхронизация ходов без задержек.' },
]

const steps = [
  { title: 'Регистрация',   desc: 'Создай аккаунт за 30 секунд. Получи 500 монет в подарок.' },
  { title: 'Выбери комнату', desc: 'Выбери тему поля и тип игры — монеты или реальные деньги.' },
  { title: 'Играй',         desc: 'Бросай кубики, покупай клетки, банкроть соперников.' },
]
</script>

<style lang="scss" scoped>
.main-screen{
  background: url('/hero.png') no-repeat fixed center top/contain;
}
</style>