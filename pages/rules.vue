<template>
  <div class="page">


    <main class="content">
      <nav class="breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <span class="sep">/</span>
        <span>Правила игры</span>
      </nav>

      <h1 class="page-title">Правила игры</h1>

      <nav class="toc">
        <p class="toc-title">Содержание</p>
        <ol class="toc-list">
          <li><a href="#goal">Цель игры</a></li>
          <li><a href="#start">Начало партии</a></li>
          <li><a href="#turn">Ход игрока</a></li>
          <li><a href="#property">Покупка и продажа собственности</a></li>
          <li><a href="#build">Строительство домов и отелей</a></li>
          <li><a href="#jail">Тюрьма</a></li>
          <li><a href="#bankruptcy">Банкротство и победа</a></li>
          <li><a href="#real-money">Правила реальных денег</a></li>
          <li><a href="#themes">Игровые темы</a></li>
        </ol>
      </nav>

      <section id="goal" class="section">
        <h2 class="section-title">Цель игры</h2>
        <p>
          Стать единственным игроком, не обанкротившимся в ходе партии. Для победы необходимо
          скупить максимальное количество собственности, застроить её домами и отелями и довести
          соперников до банкротства, взимая арендную плату за каждое посещение ваших владений.
        </p>
      </section>

      <section id="start" class="section">
        <h2 class="section-title">Начало партии</h2>
        <p>Перед стартом каждый игрок выбирает:</p>
        <ul class="rule-list">
          <li><strong>Тему</strong> — Футбол, Хоккей, Империя или Политика. Тема определяет названия улиц и визуальное оформление поля.</li>
          <li><strong>Фишку</strong> — уникальный игровой персонаж из набора выбранной темы.</li>
          <li><strong>Стартовый взнос</strong> — размер ставки для партии на реальные деньги. В монетном режиме взнос списывается из баланса монет.</li>
        </ul>
        <p>
          Каждый участник получает стартовый капитал. Порядок ходов определяется первым броском
          кубиков — ходит тот, кто выбросил наибольшее число. При равенстве бросок повторяется.
        </p>
      </section>

      <section id="turn" class="section">
        <h2 class="section-title">Ход игрока</h2>
        <p>На своём ходу игрок:</p>
        <ol class="rule-list ordered">
          <li>Бросает два кубика. Сумма очков определяет количество клеток для продвижения.</li>
          <li>Перемещается по полю по часовой стрелке на выпавшее число клеток.</li>
          <li>Выполняет действие, соответствующее клетке, на которой остановился.</li>
        </ol>
        <p class="highlight-box">
          Если выпало <strong>дубль</strong> (одинаковые значения на обоих кубиках) — игрок ходит ещё раз.
          Три дубля подряд отправляют игрока в тюрьму.
        </p>
        <h3 class="sub-title">Типы клеток</h3>
        <ul class="rule-list">
          <li><strong>Собственность</strong> — можно купить или заплатить аренду владельцу.</li>
          <li><strong>Старт</strong> — при прохождении или остановке начисляется бонус.</li>
          <li><strong>Шанс / Общественная казна</strong> — берётся карточка с событием.</li>
          <li><strong>Налог</strong> — обязательный платёж в банк.</li>
          <li><strong>Тюрьма (визит)</strong> — просто остановка, без последствий.</li>
          <li><strong>Отправиться в тюрьму</strong> — немедленный перевод за решётку.</li>
          <li><strong>Бесплатная стоянка</strong> — нейтральная клетка без действий.</li>
        </ul>
      </section>

      <section id="property" class="section">
        <h2 class="section-title">Покупка и продажа собственности</h2>
        <p>
          Остановившись на незанятой собственности, игрок может купить её по номинальной цене.
          Если он отказывается — автоматически проводится аукцион среди всех участников.
        </p>
        <p>
          Владелец собственности получает арендную плату от каждого игрока, кто на неё попадает.
          Размер аренды зависит от количества объектов одного цвета в собственности и уровня застройки.
        </p>
        <p>
          Игрок может продать собственность другому участнику напрямую по договорной цене или
          заложить её в банк за 50% номинала. Заложенная собственность не приносит ренту.
        </p>
      </section>

      <section id="build" class="section">
        <h2 class="section-title">Строительство домов и отелей</h2>
        <p>
          Когда игрок владеет всеми объектами одной цветовой группы, он может строить дома.
          Строительство должно вестись равномерно: нельзя поставить второй дом на одну улицу,
          пока на других улицах группы нет хотя бы одного.
        </p>
        <ul class="rule-list">
          <li>Максимум <strong>4 дома</strong> на каждую улицу.</li>
          <li>После 4 домов можно построить <strong>отель</strong>, вернув дома в банк.</li>
          <li>Отель — максимальный уровень застройки; аренда при нём максимальна.</li>
        </ul>
        <p>
          Дома и отели продаются обратно в банк за половину стоимости в любой момент хода.
        </p>
      </section>

      <section id="jail" class="section">
        <h2 class="section-title">Тюрьма</h2>
        <p>В тюрьму попадают тремя способами:</p>
        <ul class="rule-list">
          <li>Остановка на клетке «Отправиться в тюрьму».</li>
          <li>Выпадение дубля три раза подряд.</li>
          <li>Карточка шанса с соответствующим текстом.</li>
        </ul>
        <p>Выбраться из тюрьмы можно:</p>
        <ul class="rule-list">
          <li>Выбросить дубль в течение трёх ходов.</li>
          <li>Заплатить штраф до броска кубиков.</li>
          <li>Использовать карточку «Выход из тюрьмы бесплатно».</li>
        </ul>
        <p>
          Находясь в тюрьме, игрок продолжает получать арендную плату со своей собственности.
          Если за три хода дубль не выпал — штраф списывается автоматически.
        </p>
      </section>

      <section id="bankruptcy" class="section">
        <h2 class="section-title">Банкротство и победа</h2>
        <p>
          Игрок признаётся банкротом, если не может оплатить долг (аренду, штраф или налог) даже
          после продажи всей собственности и домов. Всё имущество банкрота переходит кредитору
          или возвращается в банк.
        </p>
        <p>
          Победителем объявляется последний игрок, оставшийся не обанкротившимся. В партиях с
          ограничением по времени побеждает тот, кто к финалу обладает наибольшим капиталом
          (наличные + стоимость собственности + дома).
        </p>
      </section>

      <section id="real-money" class="section">
        <h2 class="section-title">Правила реальных денег</h2>
        <p class="highlight-box warning">
          Функция реальных денег доступна только верифицированным пользователям старше 18 лет.
        </p>
        <ul class="rule-list">
          <li><strong>Холд выигрыша:</strong> 30 календарных дней с момента завершения партии.</li>
          <li><strong>Минимальная сумма вывода:</strong> 500 ₽.</li>
          <li><strong>Максимальная сумма вывода в сутки:</strong> 5 000 ₽.</li>
          <li><strong>Комиссия платёжной системы:</strong> взимается сверху согласно тарифам ЮKassa.</li>
          <li><strong>Возврат средств:</strong> возможен только до начала партии; начатая игра возврату не подлежит.</li>
          <li><strong>Налогообложение:</strong> крупные выигрыши подлежат декларированию согласно законодательству РФ.</li>
        </ul>
      </section>

      <section id="themes" class="section">
        <h2 class="section-title">Игровые темы</h2>
        <div class="themes-grid">
          <div class="theme-card football">
            <h3 class="theme-title">Футбол</h3>
            <p>Улицы — стадионы и клубы РФПЛ. Фишки — футбольные атрибуты. Карточки — трансферы и матчи.</p>
          </div>
          <div class="theme-card hockey">
            <h3 class="theme-title">Хоккей</h3>
            <p>Улицы — арены КХЛ. Фишки — хоккейная экипировка. Карточки — чемпионаты и легенды.</p>
          </div>
          <div class="theme-card empire">
            <h3 class="theme-title">Империя</h3>
            <p>Улицы — проспекты и площади Российской Империи. Фишки — дворянские гербы. Карточки — исторические события.</p>
          </div>
          <div class="theme-card politics">
            <h3 class="theme-title">Политика</h3>
            <p>Улицы — министерства и ведомства. Фишки — политические символы. Карточки — указы и реформы.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Правила игры — Монополис',
  meta: [{ name: 'description', content: 'Подробные правила онлайн-монополии Монополис: ход игры, строительство, тюрьма, банкротство и правила вывода реальных денег.' }],
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

.toc {
  background: $noir-card;
  border: 1px solid $noir-border;
  border-radius: $radius-card;
  padding: $space-lg;
  margin-bottom: $space-xl;
}

.toc-title {
  font-family: $font-sans;
  font-size: $text-label;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: $ivory-muted;
  margin-bottom: $space-sm;
}

.toc-list {
  margin: 0;
  padding-left: $space-lg;
  display: flex;
  flex-direction: column;
  gap: 4px;

  li a {
    font-family: $font-sans;
    font-size: $text-body;
    color: $gold;
    text-decoration: none;
    transition: color $transition-fast;

    &:hover { color: $gold-light; }
  }
}

.section {
  margin-bottom: $space-xl;
  scroll-margin-top: 80px;

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

.sub-title {
  font-family: $font-serif;
  font-size: $text-subhead;
  color: $ivory;
  margin: $space-md 0 $space-sm;
}

.rule-list {
  padding-left: $space-lg;
  margin: 0 0 $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  &.ordered { list-style: decimal; }

  li {
    font-family: $font-sans;
    font-size: $text-body;
    line-height: 1.7;
    color: $ivory;
  }

  strong { color: $gold-light; }
}

.highlight-box {
  background: $noir-card;
  border-left: 3px solid $gold;
  padding: $space-sm $space-md;
  border-radius: 0 $radius-card $radius-card 0;
  font-family: $font-sans;
  font-size: $text-body;
  color: $ivory;
  margin-bottom: $space-md;

  &.warning {
    border-color: #D97706;
    color: #FCD34D;
    background: rgba(217, 119, 6, 0.08);
  }
}

.themes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-md;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.theme-card {
  padding: $space-md;
  border-radius: $radius-card;
  border: 1px solid $noir-border;

  p {
    font-size: $text-body;
    line-height: 1.6;
    margin: 0;
    color: $ivory-muted;
  }

  &.football { border-color: rgba(30, 107, 46, 0.5); background: rgba(30, 107, 46, 0.06); }
  &.hockey   { border-color: rgba(26, 35, 126, 0.5); background: rgba(26, 35, 126, 0.06); }
  &.empire   { border-color: rgba(123, 31, 162, 0.5); background: rgba(123, 31, 162, 0.06); }
  &.politics { border-color: rgba(183, 28, 28, 0.5); background: rgba(183, 28, 28, 0.06); }
}

.theme-title {
  font-family: $font-serif;
  font-size: $text-subhead;
  color: $gold;
  margin-bottom: $space-sm;
}
</style>
