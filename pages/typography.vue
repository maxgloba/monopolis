<script setup lang="ts">
definePageMeta({ layout: false })

const sidebarOpen = ref(false)
const isDark = ref(true)
function toggleTheme() { isDark.value = !isDark.value }

function navClick() {
  sidebarOpen.value = false
}

const sections = [
  { id: 'brand',      label: 'Бренд' },
  { id: 'headings',   label: 'Заголовки' },
  { id: 'body',       label: 'Текст' },
  { id: 'fontsizes',  label: 'Размеры' },
  { id: 'colors',     label: 'Цвета' },
  { id: 'gradients',  label: 'Градиенты' },
  { id: 'buttons',    label: 'Кнопки' },
  { id: 'inputs',     label: 'Инпуты' },
  { id: 'badges',     label: 'Бейджи' },
  { id: 'cards',      label: 'Карточки' },
  { id: 'dividers',   label: 'Разделители' },
  { id: 'animations', label: 'Анимации' },
  { id: 'themes',     label: 'Темы игры' },
]

const palette = [
  { group: 'Gold',  items: [
    { name: 'gold',       hex: '#D4A017', cls: 'bg-gold' },
    { name: 'gold-light', hex: '#E8B830', cls: 'bg-gold-light' },
    { name: 'gold-dark',  hex: '#B8860B', cls: 'bg-gold-dark' },
    { name: 'gold-muted', hex: '#8A7A5A', cls: 'bg-gold-muted' },
    { name: 'gold-faint', hex: '#2A2218', cls: 'bg-gold-faint' },
  ]},
  { group: 'Noir',  items: [
    { name: 'noir',         hex: '#0A0A0A', cls: 'bg-noir' },
    { name: 'noir-surface', hex: '#111008', cls: 'bg-noir-surface' },
    { name: 'noir-card',    hex: '#161410', cls: 'bg-noir-card' },
    { name: 'noir-border',  hex: '#2A2218', cls: 'bg-noir-border' },
  ]},
  { group: 'Ivory', items: [
    { name: 'ivory',       hex: '#F5F0E8', cls: 'bg-ivory' },
    { name: 'ivory-muted', hex: '#C4B898', cls: 'bg-ivory-muted' },
    { name: 'ivory-faint', hex: '#5A4E3A', cls: 'bg-ivory-faint' },
  ]},
  { group: 'Темы', items: [
    { name: 'football', hex: '#1E6B2E', cls: 'bg-theme-football' },
    { name: 'hockey',   hex: '#1A237E', cls: 'bg-theme-hockey' },
    { name: 'empire',   hex: '#7B1FA2', cls: 'bg-theme-empire' },
    { name: 'politics', hex: '#B71C1C', cls: 'bg-theme-politics' },
  ]},
]
</script>

<template>
  <div class="typo-page" :class="{ 'sidebar-is-open': sidebarOpen, 'theme-light': !isDark }">

    <!-- Шапка -->
    <header class="top-bar">
      <div class="flex gap-0">
        <img src="/favicon.png" alt="Монополис" class="top-bar__logo">
        <div class="h1">онополис</div>
      </div>
      <div class="top-bar__right">
        <button class="top-bar__theme" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <button class="top-bar__burger" @click="sidebarOpen = !sidebarOpen" :aria-expanded="sidebarOpen">
          <span :class="{ 'is-open': sidebarOpen }"></span>
          <span :class="{ 'is-open': sidebarOpen }"></span>
          <span :class="{ 'is-open': sidebarOpen }"></span>
        </button>
      </div>
    </header>

    <!-- Оверлей -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Сайдбар -->
    <nav class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <div class="sidebar__label">Дизайн-система</div>
      <div class="sidebar__links">
        <a
          v-for="s in sections"
          :key="s.id"
          :href="`#${s.id}`"
          class="sidebar__item"
          @click="navClick"
        >
          {{ s.label }}
        </a>
      </div>
    </nav>

    <div class="typo-content">

      <!-- Заголовок страницы -->
      <div class="page-header">
        <p class="text-label mb-2">Документация</p>
        <h1 class="text-imperial">Дизайн-система</h1>
        <p class="text-gold-muted mt-3 text-sm">
          Типографика, цвета, компоненты и анимации проекта Монополис
        </p>
      </div>

      <!-- ─── БРЕНД ────────────────────────────────────────── -->
      <section id="brand" class="section">
        <h2 class="section__title">Бренд</h2>
        <div class="demo-block">
          <p class="demo-label">Логотип и фавикон</p>
          <div class="brand-row">
            <div class="brand-item">
              <div class="brand-preview brand-preview--dark">
                <img src="/logo.png" alt="Монополис логотип" class="w-96">
              </div>
              <code>logo.png · на тёмном</code>
            </div>
            <div class="brand-item">
              <div class="brand-preview">
                <img src="/logo-bg.png" alt="Монополис логотип" class="w-96">
              </div>
              <code>logo.png · на тёмном</code>
            </div>
          </div>
          <div class="brand-row mt-10">
            <div class="brand-item">
              <img class="w-40" src="/favicon.png" alt="favicon">
            </div>
            <div class="brand-item">
              <img class="w-24" src="/favicon.png" alt="favicon">
            </div>
            <div class="brand-item">
              <img class="w-16" src="/favicon.png" alt="favicon">
            </div>
          </div>
        </div>
      </section>

      <!-- ─── ЗАГОЛОВКИ ─────────────────────────────────────── -->
      <section id="headings" class="section">
        <h2 class="section__title">Заголовки</h2>

        <div class="demo-block prose">
          <h1>H1. Монополис — премиальная онлайн-игра</h1>
          <p>Адрес «Монополис» известен многим любителям настольных игр разных поколений. Именно здесь был создан первый в России специализированный онлайн-проект с российскими тематиками — от футбола РПЛ до имперских залов.</p>

          <h2>H2. Очень длинный заголовок второго уровня интерфейса</h2>
          <p>Типовые элементы оформляются в системе через визуальный редактор. Чтобы разработчику было легче в них ориентироваться, их количество лучше свести к необходимому минимуму.</p>

          <h3>H3. Делаем заголовки нарочито длинными, чтобы убедиться в правильном интерлиньяже</h3>
          <p>Имманентный подход подразумевает отношение к тексту как к автономной реальности, нацеленность на выявление его внутренней структуры. Репрезентативный — рассмотрение текста как особой формы представления знаний о внешней тексту действительности.</p>

          <h4>H4. В первую очередь нас интересуют интерлиньяж и отступы. И еще одно предложение</h4>
          <p>Текст состоит из некоторого количества предложений. Одно предложение, даже очень распространённое, сложное, текстом назвать нельзя, поскольку текст можно расчленить на самостоятельные предложения, а части предложения сочетаются по законам синтаксиса.</p>

          <h5>H5. Заголовок пятого уровня</h5>
          <p>Текст состоит из некоторого количества предложений. Одно предложение, даже очень распространённое, сложное, текстом назвать нельзя, поскольку текст можно расчленить на самостоятельные предложения.</p>

          <h6>H6. Низкоуровневый заголовок</h6>
          <p>Самый «нижний» заголовок h6 предваряет такие элементы, как «Примечание» или «Таблица».</p>
          <p>Самый «нижний» заголовок h6 предваряет такие элементы, как «Примечание» или «Таблица».</p>

          <h2>Несколько заголовков подряд h2</h2>
          <h3>Проверяем сочетание: интерлиньяж и отступы h3</h3>
          <h4>В реальной ситуации подобных скоплений заголовков лучше избегать h4</h4>
          <p>Если за заголовком более низкого уровня сразу следует заголовок более высокого, это нарушает композиционную связность элементов оформления и логику повествования. Поэтому после заголовка должен следовать текст, который этот заголовок озаглавливает.</p>
        </div>

        <div class="demo-block">
          <p class="demo-label">CSS-классы типографики</p>
          <div class="text-imperial mb-2">text-imperial</div>
          <div class="text-heading mb-2">text-heading</div>
          <div class="text-label mb-2">text-label</div>
          <div class="text-gold mb-2 text-sm">text-gold</div>
          <div class="text-ivory mb-2 text-sm">text-ivory</div>
          <div class="text-muted text-sm">text-muted</div>
        </div>
      </section>

      <!-- ─── ТЕКСТ / СПИСКИ ────────────────────────────────── -->
      <section id="body" class="section">
        <h2 class="section__title">Текст</h2>

        <div class="demo-block prose">
          <p class="demo-label">Цитата</p>
          <blockquote class="quote-imperial">
            «Богатство — это не то, что ты имеешь, а то, что ты умеешь делать с тем, что имеешь.»
          </blockquote>
        </div>

        <div class="demo-block">
          <div class="lists-grid">
            <div>
              <p class="demo-label">ul — маркированный</p>
              <ul class="list-imperial">
                <li>Если пункты списка длинные и представляют собой развернутые предложения, они должны начинаться с прописной буквы и заканчиваться точкой.</li>
                <li>Если пункты списка короткие, не являются самостоятельной законченной конструкцией и грамматически тесно связаны с предшествующей списку вводной фразой, они должны начинаться со строчной буквы и заканчиваться точкой с запятой.</li>
              </ul>
            </div>
            <div>
              <p class="demo-label">ol — нумерованный</p>
              <ol class="list-imperial list-imperial--ordered">
                <li>Если пункты списка длинные и представляют собой развернутые предложения, они должны начинаться с прописной буквы и заканчиваться точкой.</li>
                <li>Если пункты списка короткие, не являются самостоятельной законченной конструкцией и грамматически тесно связаны с предшествующей списку вводной фразой, они должны начинаться со строчной буквы и заканчиваться точкой с запятой.</li>
              </ol>
            </div>
            <div>
              <p class="demo-label">.list-check — с чекмарком</p>
              <ul class="list-imperial list-imperial--check">
                <li>Если пункты списка длинные и представляют собой развернутые предложения, они должны начинаться с прописной буквы и заканчиваться точкой.</li>
                <li>Если пункты списка короткие, не являются самостоятельной законченной конструкцией и грамматически тесно связаны с предшествующей списку вводной фразой.</li>
              </ul>
            </div>
            <div>
              <p class="demo-label">Произвольный маркер (emoji)</p>
              <ul class="list-imperial list-imperial--emoji">
                <li data-marker="🏆">Если пункты списка длинные и представляют собой развернутые предложения, они должны начинаться с прописной буквы и заканчиваться точкой.</li>
                <li data-marker="🎲">Если пункты списка короткие, не являются самостоятельной законченной конструкцией и грамматически тесно связаны с предшествующей списку вводной фразой.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── РАЗМЕРЫ ШРИФТОВ ──────────────────────────────── -->
      <section id="fontsizes" class="section">
        <h2 class="section__title">Размеры</h2>
        <div class="demo-block">
          <div class="fontsize-row"><span class="fontsize-name">caption / 10px</span><span class="text-[10px] text-ivory">Монополис — премиальная онлайн-игра</span></div>
          <div class="fontsize-row"><span class="fontsize-name">label / 11px</span><span class="text-[11px] text-ivory tracking-widest uppercase">Монополис — Онлайн-игра</span></div>
          <div class="fontsize-row"><span class="fontsize-name">body / 14px</span><span class="text-sm text-ivory">Монополис — премиальная онлайн-игра</span></div>
          <div class="fontsize-row"><span class="fontsize-name">subhead / 18px</span><span class="text-lg text-ivory">Монополис — онлайн-игра</span></div>
          <div class="fontsize-row"><span class="fontsize-name">heading / 24px</span><span class="text-2xl text-gold font-serif">Монополис</span></div>
          <div class="fontsize-row"><span class="fontsize-name">imperial / 32px</span><span class="text-[32px] text-gold font-serif tracking-[3px]">МОНОПОЛИС</span></div>
        </div>
      </section>

      <!-- ─── ЦВЕТА ──────────────────────────────────────────── -->
      <section id="colors" class="section">
        <h2 class="section__title">Цвета</h2>
        <div v-for="group in palette" :key="group.group" class="color-group">
          <p class="demo-label">{{ group.group }}</p>
          <div class="color-row">
            <div
              v-for="c in group.items"
              :key="c.name"
              class="color-swatch"
            >
              <div class="color-swatch__box" :style="`background:${c.hex}`"></div>
              <div class="color-swatch__name">{{ c.name }}</div>
              <div class="color-swatch__hex">{{ c.hex }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── ГРАДИЕНТЫ ────────────────────────────────────── -->
      <section id="gradients" class="section">
        <h2 class="section__title">Градиенты</h2>
        <div class="demo-block">
          <div class="gradient-row">
            <div class="gradient-item">
              <div class="gradient-box bg-gold-gradient"></div>
              <span class="gradient-label">gold-gradient</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-dark-surface"></div>
              <span class="gradient-label">dark-surface</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-gold-divider"></div>
              <span class="gradient-label">gold-line</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-gold-full"></div>
              <span class="gradient-label">gold-tri</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-theme-football-g"></div>
              <span class="gradient-label">football</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-theme-hockey-g"></div>
              <span class="gradient-label">hockey</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-theme-empire-g"></div>
              <span class="gradient-label">empire</span>
            </div>
            <div class="gradient-item">
              <div class="gradient-box bg-theme-politics-g"></div>
              <span class="gradient-label">politics</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── КНОПКИ ────────────────────────────────────────── -->
      <section id="buttons" class="section">
        <h2 class="section__title">Кнопки</h2>

        <div class="demo-block">
          <p class="demo-label">На тёмном фоне</p>
          <div class="btn-row">
            <div class="btn-item">
              <button class="btn btn-primary btn-lg">Играть сейчас</button>
              <code>.btn.btn-primary.btn-lg</code>
            </div>
            <div class="btn-item">
              <button class="btn btn-primary">Войти</button>
              <code>.btn.btn-primary</code>
            </div>
            <div class="btn-item">
              <button class="btn btn-primary btn-sm">Создать</button>
              <code>.btn.btn-primary.btn-sm</code>
            </div>
            <div class="btn-item">
              <button class="btn btn-secondary btn-lg">Создать комнату</button>
              <code>.btn.btn-secondary.btn-lg</code>
            </div>
            <div class="btn-item">
              <button class="btn btn-secondary">Подробнее</button>
              <code>.btn.btn-secondary</code>
            </div>
            <div class="btn-item">
              <button class="btn btn-primary" disabled>Недоступно</button>
              <code>disabled</code>
            </div>
          </div>
        </div>

        <div class="demo-block">
          <p class="demo-label">На всю ширину</p>
          <div class="max-w-xs flex flex-col gap-2.5">
            <button class="btn btn-primary btn-full">Войти в игру</button>
            <button class="btn btn-secondary btn-full">Зарегистрироваться</button>
          </div>
        </div>
      </section>

      <!-- ─── ИНПУТЫ ────────────────────────────────────────── -->
      <section id="inputs" class="section">
        <h2 class="section__title">Инпуты</h2>
        <div class="demo-block max-w-sm">
          <div class="input-group">
            <label class="text-label">Никнейм</label>
            <input class="input" type="text" placeholder="Введите никнейм">
          </div>
          <div class="input-group">
            <label class="text-label">Email</label>
            <input class="input" type="email" placeholder="your@email.com">
          </div>
          <div class="input-group">
            <label class="text-label">Пароль</label>
            <input class="input" type="password" placeholder="••••••••">
          </div>
          <div class="input-group">
            <label class="text-label text-theme-politics">Ошибка ввода</label>
            <input class="input error" type="text" value="Неверный формат email">
          </div>
        </div>
      </section>

      <!-- ─── БЕЙДЖИ ────────────────────────────────────────── -->
      <section id="badges" class="section">
        <h2 class="section__title">Бейджи</h2>
        <div class="demo-block">
          <div class="badge-row">
            <div class="badge-item">
              <span class="badge badge-gold">Premium</span>
              <code>.badge.badge-gold</code>
            </div>
            <div class="badge-item">
              <span class="badge badge-ivory">Verified</span>
              <code>.badge.badge-ivory</code>
            </div>
            <div class="badge-item">
              <span class="badge badge-gold">Real Money</span>
              <code>.badge.badge-gold</code>
            </div>
            <div class="badge-item">
              <span class="badge badge-ivory">Beta</span>
              <code>.badge.badge-ivory</code>
            </div>
            <div class="badge-item theme-football">
              <span class="badge badge-theme">Футбол</span>
              <code>.badge.badge-theme</code>
            </div>
            <div class="badge-item theme-hockey">
              <span class="badge badge-theme">Хоккей</span>
              <code>.badge.badge-theme</code>
            </div>
            <div class="badge-item theme-empire">
              <span class="badge badge-theme">Империя</span>
              <code>.badge.badge-theme</code>
            </div>
            <div class="badge-item theme-politics">
              <span class="badge badge-theme">Политика</span>
              <code>.badge.badge-theme</code>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── КАРТОЧКИ ──────────────────────────────────────── -->
      <section id="cards" class="section">
        <h2 class="section__title">Карточки</h2>
        <div class="demo-block">
          <div class="cards-grid">
            <div class="card">
              <div class="text-label mb-1.5">Баланс</div>
              <div class="font-serif text-[28px] text-gold">14 500</div>
              <div class="text-xs text-ivory-faint mt-1">виртуальных монет</div>
            </div>
            <div class="card">
              <div class="text-label mb-1.5">Побед</div>
              <div class="font-serif text-[28px] text-gold">47</div>
              <div class="text-xs text-ivory-faint mt-1">из 89 партий (53%)</div>
            </div>
            <div class="card">
              <div class="text-label mb-1.5">Рейтинг</div>
              <div class="font-serif text-[28px] text-gold">#312</div>
              <div class="text-xs text-ivory-faint mt-1">глобальный</div>
            </div>
            <div class="card">
              <div class="text-label mb-1.5">Статус</div>
              <div class="my-2"><span class="badge badge-gold">Premium</span></div>
              <div class="text-xs text-ivory-faint">до 01.01.2027</div>
            </div>
          </div>
        </div>

        <div class="demo-block">
          <p class="demo-label">Карточка с анимацией goldPulse (активный ход)</p>
          <div class="card animate-gold-pulse max-w-[220px]">
            <div class="text-label mb-1.5">Ваш ход</div>
            <div class="text-sm text-ivory">Бросьте кубики</div>
          </div>
        </div>
      </section>

      <!-- ─── РАЗДЕЛИТЕЛИ ───────────────────────────────────── -->
      <section id="dividers" class="section">
        <h2 class="section__title">Разделители</h2>
        <div class="demo-block">
          <p class="demo-label">.divider-imperial — с ромбом</p>
          <div class="divider-imperial"><div class="diamond"></div></div>

          <p class="demo-label mt-6">Золотая линия (via ::before в .card)</p>
          <div class="h-px bg-gold-divider my-2"></div>

          <p class="demo-label mt-6">Граница секции</p>
          <div class="h-px bg-noir-border my-2"></div>
        </div>
      </section>

      <!-- ─── АНИМАЦИИ ──────────────────────────────────────── -->
      <section id="animations" class="section">
        <h2 class="section__title">Анимации</h2>
        <div class="demo-block">
          <div class="anim-grid">
            <div class="anim-item">
              <div class="anim-demo animate-slide-up bg-noir-card border border-noir-border p-4 text-center">
                <span class="text-xs text-gold-muted">slideUp</span>
              </div>
              <code>.animate-slide-up</code>
            </div>
            <div class="anim-item">
              <div class="anim-demo animate-fade-in bg-noir-card border border-noir-border p-4 text-center">
                <span class="text-xs text-gold-muted">fadeIn</span>
              </div>
              <code>.animate-fade-in</code>
            </div>
            <div class="anim-item">
              <div class="anim-demo animate-gold-pulse bg-noir-card border border-gold p-4 text-center">
                <span class="text-xs text-gold">goldPulse</span>
              </div>
              <code>.animate-gold-pulse</code>
            </div>
            <div class="anim-item">
              <div class="anim-demo animate-piece-move bg-gold w-10 h-10 rounded-full mx-auto"></div>
              <code>.animate-piece-move</code>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── ТЕМЫ ИГРЫ ─────────────────────────────────────── -->
      <section id="themes" class="section">
        <h2 class="section__title">Темы игры</h2>
        <div class="demo-block">
          <div class="themes-grid">
            <div class="theme-card theme-football">
              <div class="theme-card__accent"></div>
              <div class="theme-card__badge"><span class="badge badge-theme">Футбол РПЛ</span></div>
              <div class="theme-card__title">Футбол</div>
              <div class="theme-card__desc">Российская Премьер-Лига</div>
            </div>
            <div class="theme-card theme-hockey">
              <div class="theme-card__accent"></div>
              <div class="theme-card__badge"><span class="badge badge-theme">Хоккей КХЛ</span></div>
              <div class="theme-card__title">Хоккей</div>
              <div class="theme-card__desc">Континентальная Хоккейная Лига</div>
            </div>
            <div class="theme-card theme-empire">
              <div class="theme-card__accent"></div>
              <div class="theme-card__badge"><span class="badge badge-theme">Империя</span></div>
              <div class="theme-card__title">Империя</div>
              <div class="theme-card__desc">Российская Империя</div>
            </div>
            <div class="theme-card theme-politics">
              <div class="theme-card__accent"></div>
              <div class="theme-card__badge"><span class="badge badge-theme">Политика</span></div>
              <div class="theme-card__title">Политика</div>
              <div class="theme-card__desc">Россия — политическая карта</div>
            </div>
          </div>
        </div>
      </section>

      <div class="divider-imperial mt-12 mb-6"><div class="diamond"></div></div>
      <p class="text-xs text-ivory-faint text-center pb-12">
        Монополис Design System v1.0 · Удали эти страницы перед продакшн-деплоем
      </p>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.typo-page {
  background: $noir;
  min-height: 100vh;
  color: $ivory;
  font-family: $font-sans;
}

// ── Топ-бар ──────────────────────────────────────────────────
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  background: $noir-surface;
  border-bottom: 1px solid $noir-border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 0px;
  height: 64px;

  &__logo {
    height: 50px;
    width: auto;
    display: block;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__burger,
  &__theme {
    width: 36px;
    height: 36px;
    background: none;
    border: 1px solid $noir-border;
    border-radius: $radius-card;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: border-color $transition-fast;
    flex-shrink: 0;
    &:hover { border-color: $gold; }
  }

  &__theme {
    font-size: 16px;
    gap: 0;
    line-height: 1;
  }

  &__burger span {
    display: block;
    width: 16px;
    height: 1px;
    background: $gold;
    transition: transform $transition-fast, opacity $transition-fast;

    &.is-open:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    &.is-open:nth-child(2) { opacity: 0; }
    &.is-open:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  }
}

// ── Оверлей ──────────────────────────────────────────────────
.sidebar-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: rgba($noir, 0.7);
  backdrop-filter: blur(2px);
  opacity: 0;
  pointer-events: none;
  transition: opacity $transition-normal;
}

.sidebar-is-open .sidebar-overlay {
  opacity: 1;
  pointer-events: all;
}

// ── Сайдбар ──────────────────────────────────────────────────
.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 240px;
  background: $noir-surface;
  border-right: 1px solid $noir-border;
  transform: translateX(-100%);
  transition: transform $transition-normal;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--open {
    transform: translateX(0);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid $noir-border;
    flex-shrink: 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 20px;
      right: 20px;
      height: 1px;
      background: linear-gradient(90deg, $gold-faint, transparent);
    }
  }

  &__logo {
    font-family: $font-serif;
    color: $gold;
    font-size: 13px;
    letter-spacing: 3px;
  }

  &__close {
    background: none;
    border: none;
    color: $ivory-faint;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 6px;
    transition: color $transition-fast;
    line-height: 1;

    &:hover { color: $gold; }
  }

  &__label {
    font-size: $text-label;
    color: $ivory-faint;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 14px 20px 10px;
    flex-shrink: 0;
  }

  &__links {
    overflow-y: auto;
    flex: 1;
    padding: 4px 0 24px;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: $gold-faint; border-radius: 2px; }
  }

  &__item {
    display: block;
    font-size: 12px;
    color: $ivory-faint;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    padding: 10px 20px;
    transition: all $transition-fast;
    border-left: 2px solid transparent;

    &:hover {
      color: $gold;
      background: rgba($gold, 0.04);
      border-left-color: $gold-faint;
    }
  }
}

// ── Контент ──────────────────────────────────────────────────
.typo-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 40px 48px 40px;
}

.page-header {
  margin-bottom: 56px;
  padding-bottom: 32px;
  border-bottom: 1px solid $noir-border;
}

// ── Секции ───────────────────────────────────────────────────
.section {
  margin-bottom: 64px;
  scroll-margin-top: 32px;

  &__title {
    font-family: $font-serif;
    font-size: 20px;
    color: $ivory-muted;
    letter-spacing: 2px;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid $noir-border;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 40px;
      height: 1px;
      background: $gold;
    }
  }
}

.demo-block {
  background: $noir-card;
  border: 1px solid $noir-border;
  border-radius: $radius-card;
  padding: $space-lg $space-xl;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $gold-faint, transparent);
  }
}

.demo-label {
  font-size: $text-label;
  color: $ivory-faint;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

// ── Размеры шрифтов ─────────────────────────────────────────
.fontsize-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}

.fontsize-name {
  font-size: 11px;
  color: $ivory-faint;
  letter-spacing: 2px;
  text-transform: uppercase;
  width: 120px;
  flex-shrink: 0;
}

// ── Цвета ────────────────────────────────────────────────────
.color-group {
  margin-bottom: 24px;
}

.color-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-swatch {
  text-align: center;

  &__box {
    width: 72px;
    height: 52px;
    border-radius: $radius-card;
    border: 1px solid $noir-border;
    margin-bottom: 6px;
  }

  &__name {
    font-size: 10px;
    color: $gold-muted;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }

  &__hex {
    font-size: 9px;
    color: $ivory-faint;
    font-family: 'Courier New', monospace;
  }
}

// ── Градиенты ────────────────────────────────────────────────
.gradient-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.gradient-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.gradient-box {
  width: 96px;
  height: 72px;
  border-radius: $radius-card;
  border: 1px solid $noir-border;
}

.gradient-label {
  font-size: 10px;
  color: $ivory-faint;
  letter-spacing: 1px;
  text-align: center;
}

// ── Кнопки ───────────────────────────────────────────────────
.btn-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.btn-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  code {
    font-size: 9px;
    color: $ivory-faint;
    font-family: 'Courier New', monospace;
    background: rgba($ivory, 0.04);
    padding: 2px 6px;
    border-radius: 2px;
    white-space: nowrap;
  }
}

// ── Инпуты ───────────────────────────────────────────────────
.input-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 6px;
  }
}

// ── Бейджи ───────────────────────────────────────────────────
.badge-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  code {
    font-size: 9px;
    color: $ivory-faint;
    font-family: 'Courier New', monospace;
    background: rgba($ivory, 0.04);
    padding: 2px 6px;
    border-radius: 2px;
  }

  &.theme-football { --theme-color: #{$theme-football}; --theme-bg: rgba(30,107,46,0.1); }
  &.theme-hockey   { --theme-color: #{$theme-hockey};   --theme-bg: rgba(26,35,126,0.1); }
  &.theme-empire   { --theme-color: #{$theme-empire};   --theme-bg: rgba(123,31,162,0.1); }
  &.theme-politics { --theme-color: #{$theme-politics}; --theme-bg: rgba(183,28,28,0.1); }
}

// ── Карточки ─────────────────────────────────────────────────
.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

// ── Анимации ─────────────────────────────────────────────────
.anim-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.anim-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;

  code {
    font-size: 9px;
    color: $ivory-faint;
    font-family: 'Courier New', monospace;
    background: rgba($ivory, 0.04);
    padding: 2px 6px;
    border-radius: 2px;
  }
}

.anim-demo {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-card;
}

// ── Темы ─────────────────────────────────────────────────────
.themes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.theme-card {
  background: var(--theme-bg);
  border: 1px solid var(--theme-color);
  border-radius: $radius-card;
  padding: $space-md;
  position: relative;
  overflow: hidden;

  &__accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--theme-color);
  }

  &__badge {
    margin-bottom: 12px;
  }

  &__title {
    font-family: $font-serif;
    font-size: 18px;
    color: var(--theme-color);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: 11px;
    color: $ivory-faint;
    letter-spacing: 1px;
  }

  &.theme-football { --theme-color: #{$theme-football}; --theme-bg: rgba(30,107,46,0.08); }
  &.theme-hockey   { --theme-color: #{$theme-hockey};   --theme-bg: rgba(26,35,126,0.08); }
  &.theme-empire   { --theme-color: #{$theme-empire};   --theme-bg: rgba(123,31,162,0.08); }
  &.theme-politics { --theme-color: #{$theme-politics}; --theme-bg: rgba(183,28,28,0.08); }
}

// ── Цитата ────────────────────────────────────────────────────
.quote-imperial {
  border-left: 2px solid $gold;
  padding: 12px 20px;
  margin: 0;
  font-family: $font-serif;
  font-size: 16px;
  color: $ivory-muted;
  font-style: italic;
  background: rgba($gold, 0.03);
}

// ── Бренд ─────────────────────────────────────────────────────
.brand-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  code {
    font-size: 9px;
    color: $ivory-faint;
    font-family: 'Courier New', monospace;
    background: rgba($ivory, 0.04);
    padding: 2px 6px;
    border-radius: 2px;
    white-space: nowrap;
  }
}

.brand-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;

  &--dark    { 
    background: $noir;
    border: 1px solid $noir-border;
    border-radius: $radius-card;
  }
  &--surface { 
    background: $noir-surface;
    border: 1px solid $noir-border;
    border-radius: $radius-card;
  }
}

// ── Prose — живые примеры заголовков ─────────────────────────
.prose {
  // Внутри .demo-block переопределяем h1-h6 чтобы они выглядели
  // как на реальной странице, а не получали отступ от родителя секции
  h1 { margin-top: 0; }
  h2 { margin-top: $space-xl; }
  h3 { margin-top: $space-lg; }
  h4, h5, h6 { margin-top: $space-md; }
  p { margin-bottom: $space-sm; }
  p:last-child { margin-bottom: 0; }
}

// ── Сетка списков ─────────────────────────────────────────────
.lists-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

// ── Списки ────────────────────────────────────────────────────
.list-imperial {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: 18px;
    font-size: $text-body;
    color: $ivory;
    line-height: 1.7;
    margin-bottom: 10px;

    &::before {
      content: '◆';
      position: absolute;
      left: 0;
      color: $gold;
      font-size: 7px;
      top: 6px;
    }
  }

  &--ordered {
    counter-reset: imperial-counter;

    li {
      counter-increment: imperial-counter;
      padding-left: 22px;

      &::before {
        content: counter(imperial-counter) '.';
        font-family: $font-serif;
        color: $gold;
        font-size: 12px;
        font-style: normal;
        top: 1px;
      }
    }
  }

  &--check {
    li::before {
      content: '✓';
      font-size: 11px;
      color: $gold;
      font-weight: 700;
      top: 2px;
    }
  }

  &--emoji {
    li {
      padding-left: 26px;

      &::before {
        content: attr(data-marker);
        font-size: 13px;
        top: 1px;
        left: 0;
      }
    }
  }
}

// ── Переключатель темы ───────────────────────────────────────
.theme-toggle {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 300;
  width: 36px;
  height: 36px;
  background: $noir-card;
  border: 1px solid $noir-border;
  border-radius: $radius-card;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: border-color $transition-fast, background $transition-fast;
  line-height: 1;

  &:hover { border-color: $gold; background: $noir-surface; }
}

// ── Светлая тема ─────────────────────────────────────────────
.theme-light {
  // ── Основа ───────────────────────────────────────────────
  background: #F5F0E8;
  color: #1A1208;

  .typo-content { background: #F5F0E8; }

  // ── Шапка и сайдбар ──────────────────────────────────────
  .top-bar {
    background: #EDE8DF;
    border-bottom-color: #C8BCA0;
    &__burger span { background: #6B5A3A; }
    &__burger, &__theme { border-color: #C8BCA0; color: #3A2E1A; }
  }

  .sidebar {
    background: #EDE8DF;
    border-right-color: #C8BCA0;
  }
  .sidebar__logo { color: #B8860B; }
  .sidebar__label { color: #6B5A3A; }
  .sidebar__item { color: #3A2E1A; &:hover { color: #B8860B; } }
  .sidebar-overlay { background: rgba(#3A2E1A, 0.4); }

  // ── Заголовки и текст ─────────────────────────────────────
  h1, .h1 { color: #B8860B; }
  h2, .h2, h3, .h3 { color: #1A1208; }
  h4, .h4, h5, .h5, h6, .h6 { color: #3A2E1A; }
  p { color: #3A2E1A; }

  // ── Утилиты текста ────────────────────────────────────────
  .text-gold   { color: #9A7010 !important; }
  .text-ivory  { color: #2A1E08 !important; }
  .text-muted  { color: #6B5A3A !important; }
  .text-gold-muted { color: #6B5A3A; }
  .text-ivory-faint { color: #6B5A3A !important; }

  // ── Секции ───────────────────────────────────────────────
  .section { border-bottom-color: #C8BCA0; }
  .section__title { color: #1A1208; }

  // ── Демо-блоки ───────────────────────────────────────────
  .demo-block {
    background: #EDE8DF;
    border-color: #C8BCA0;
  }
  .demo-label { color: #6B5A3A; }

  // ── Карточки ─────────────────────────────────────────────
  .card {
    background: #E4DCCF;
    border-color: #C8BCA0;
    &::before { background: linear-gradient(90deg, transparent, #C8A050, transparent); }
  }

  // ── Инпуты ───────────────────────────────────────────────
  .input {
    background: #F0EBE0;
    border-color: #C8BCA0;
    border-bottom-color: #B8860B;
    color: #1A1208;
    &::placeholder { color: #9A8A6A; }
  }

  // ── Бейджи ───────────────────────────────────────────────
  .badge-gold  { background: rgba(#B8860B, 0.12); border-color: #B8860B; color: #7A5800; }
  .badge-ivory { background: rgba(#3A2E1A, 0.08); border-color: #9A8A6A; color: #3A2E1A; }

  // ── Разделители ──────────────────────────────────────────
  .divider-imperial::before { background: linear-gradient(90deg, transparent, #C8BCA0); }
  .divider-imperial::after  { background: linear-gradient(90deg, #C8BCA0, transparent); }
  .divider-imperial .diamond { background: #B8860B; }
  .h-px.bg-noir-border { background: #C8BCA0; }
  .h-px.bg-gold-divider { background: linear-gradient(90deg, transparent, #B8860B, transparent); }

  // ── Анимации (фон блоков) ─────────────────────────────────
  .anim-demo {
    background: #E4DCCF !important;
    border-color: #C8BCA0 !important;
    span { color: #6B5A3A !important; }
  }
  .anim-demo.border-gold { border-color: #B8860B !important; }
  .anim-demo.border-gold span { color: #9A7010 !important; }

  // ── Все scoped-элементы с ivory-цветами ──────────────────
  // Переопределяем все ivory/faint/muted цвета глобально
  * { --ivory-override: #2A1E08; }

  .list-imperial li { color: #3A2E1A; }
  .fontsize-row span { color: #3A2E1A !important; }
  .fontsize-row .text-2xl,
  .fontsize-row .text-\[32px\] { color: #9A7010 !important; }

  .quote-imperial {
    border-left-color: #B8860B;
    background: #E4DCCF;
    blockquote, cite { color: #3A2E1A; }
  }

  .prose {
    h1, h2, h3, h4, h5, h6 { color: #1A1208; }
    p, li { color: #3A2E1A; }
  }

  // Tailwind ivory-классы
  .text-ivory { color: #2A1E08 !important; }

  // Все scoped spans и divs с ivory-faint/muted цветами
  .gradient-label,
  .fontsize-name,
  .demo-label,
  .sidebar__label { color: #6B5A3A; }

  .color-swatch__name,
  .color-swatch__hex { color: #3A2E1A; }

  // Все code-блоки (badge-item, theme-card, anim-item и т.д.)
  code { color: #5A4A2A; background: rgba(#3A2E1A, 0.08); }

  // Описания тем
  .theme-card__desc { color: #6B5A3A; }
  .theme-card__title { color: var(--theme-color); }

  // Sidebar header border
  .sidebar__header::after { background: linear-gradient(90deg, #C8BCA0, transparent); }

  // ── Код ──────────────────────────────────────────────────
  code {
    background: rgba(#3A2E1A, 0.08);
    color: #6B5A3A;
  }

  // ── Скроллбар ────────────────────────────────────────────
  ::-webkit-scrollbar-track { background: #F5F0E8; }
  ::-webkit-scrollbar-thumb { background: #C8BCA0; }
}
</style>
