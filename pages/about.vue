<template>
  <div class="page">


    <main class="content">
      <nav class="breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <span class="sep">/</span>
        <span>О проекте</span>
      </nav>

      <h1 class="page-title">О проекте Монополис</h1>

      <section class="section">
        <h2 class="section-title">Что такое Монополис</h2>
        <p>
          Монополис — это премиальная онлайн-монополия с российской тематикой. Мы воссоздали
          классическую настольную игру в современном цифровом формате, добавив уникальные
          тематические режимы, турниры и возможность играть на реальные деньги.
        </p>
        <p>
          В отличие от западных аналогов, Монополис создан с учётом российской культуры и
          предпочтений: тематические наборы посвящены футболу, хоккею, Российской Империи и
          политике. Каждая деталь — от дизайна фишек до названий улиц — погружает в знакомую
          атмосферу.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">Миссия</h2>
        <blockquote class="mission">
          «Честная онлайн-монополия с российской душой»
        </blockquote>
        <p>
          Мы верим, что онлайн-игры должны быть прозрачными. Все игровые механики открыты,
          результаты броска кубиков не зависят от баланса счёта, а правила вывода средств
          прописаны заранее и не меняются в одностороннем порядке.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">Технологии</h2>
        <ul class="tech-list">
          <li><span class="tech-name">Nuxt.js 3</span> — фронтенд и серверная часть (SSR)</li>
          <li><span class="tech-name">TypeScript</span> — строгая типизация на всех уровнях</li>
          <li><span class="tech-name">Node.js</span> — серверная логика и API</li>
          <li><span class="tech-name">Socket.io</span> — игровые события в реальном времени</li>
          <li><span class="tech-name">MySQL</span> — хранение данных игроков и партий</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="section-title">Разработка</h2>
        <p>
          Монополис — инди-проект, созданный соло-разработчиком в сотрудничестве с
          <strong>Claude Code</strong> (AI-ассистент от Anthropic). Такой подход позволяет
          сохранять высокую скорость разработки без потери качества кода.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">Связаться с нами</h2>
        <p>
          По любым вопросам пишите на
          <a href="mailto:support@monopolis.ru" class="link">support@monopolis.ru</a>.
          Мы отвечаем в рабочие дни с 10:00 до 18:00 по московскому времени.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'О проекте — Монополис',
  meta: [{ name: 'description', content: 'Премиальная онлайн-монополия с российской тематикой. Узнайте о проекте, технологиях и команде.' }],
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.page {
  min-height: 100vh;
  background: $noir;
  color: $ivory;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: $space-xl $space-lg $space-2xl;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: $space-sm;
  font-family: $font-sans;
  font-size: $text-label;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $ivory-muted;
  margin-bottom: $space-xl;

  a {
    color: $ivory-muted;
    text-decoration: none;
    transition: color $transition-fast;

    &:hover { color: $gold; }
  }

  .sep { color: $ivory-faint; }
}

.page-title {
  font-family: $font-serif;
  font-size: $text-imperial;
  color: $gold;
  letter-spacing: 2px;
  margin-bottom: $space-xl;
}

.section {
  margin-bottom: $space-xl;

  p {
    font-family: $font-sans;
    font-size: $text-body;
    line-height: 1.8;
    color: $ivory;
    margin-bottom: $space-md;
  }

  strong { color: $gold-light; }
}

.section-title {
  font-family: $font-serif;
  font-size: $text-heading;
  color: $gold;
  margin-bottom: $space-md;
  padding-bottom: $space-sm;
  border-bottom: 1px solid $noir-border;
}

.mission {
  font-family: $font-serif;
  font-size: $text-subhead;
  font-style: italic;
  color: $gold-light;
  border-left: 3px solid $gold;
  padding: $space-md $space-lg;
  margin: $space-md 0;
  background: $noir-card;
  border-radius: 0 $radius-card $radius-card 0;
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  li {
    font-family: $font-sans;
    font-size: $text-body;
    color: $ivory;
    padding: $space-sm $space-md;
    background: $noir-card;
    border: 1px solid $noir-border;
    border-radius: $radius-card;
  }
}

.tech-name {
  color: $gold;
  font-weight: 600;
  margin-right: $space-sm;
}

.link {
  color: $gold;
  text-decoration: none;
  border-bottom: 1px solid $gold-dark;
  transition: color $transition-fast, border-color $transition-fast;

  &:hover {
    color: $gold-light;
    border-color: $gold-light;
  }
}
</style>
