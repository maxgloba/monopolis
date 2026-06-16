<template>
  <div class="page">


    <main class="content">
      <nav class="breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <span class="sep">/</span>
        <span>Политика конфиденциальности</span>
      </nav>

      <h1 class="page-title">Политика конфиденциальности</h1>
      <p class="updated">Последнее обновление: 1 июня 2025 г.</p>

      <section class="section">
        <h2 class="section-title">1. Общие положения</h2>
        <p>
          Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок обработки
          персональных данных пользователей сервиса Монополис (далее — «Сервис»), доступного по
          адресу <strong>monopolis.ru</strong>.
        </p>
        <p>
          Используя Сервис, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны
          с какими-либо её положениями, просим вас прекратить использование Сервиса.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">2. Какие данные мы собираем</h2>
        <h3 class="sub-title">Данные, предоставляемые пользователем</h3>
        <ul class="doc-list">
          <li><strong>Email-адрес</strong> — при регистрации или входе через форму.</li>
          <li><strong>Имя пользователя (никнейм)</strong> — публичный идентификатор в игре.</li>
          <li><strong>Платёжные реквизиты</strong> — обрабатываются исключительно платёжным оператором ЮKassa; мы не храним данные банковских карт.</li>
        </ul>
        <h3 class="sub-title">Данные, собираемые автоматически</h3>
        <ul class="doc-list">
          <li><strong>IP-адрес</strong> — для обеспечения безопасности и предотвращения мошенничества.</li>
          <li><strong>Cookies и localStorage</strong> — для поддержания сессии, хранения пользовательских настроек и аналитики.</li>
          <li><strong>Данные об устройстве и браузере</strong> — User-Agent, тип устройства, разрешение экрана.</li>
          <li><strong>Игровая статистика</strong> — история партий, результаты, транзакции внутри игры.</li>
        </ul>
        <h3 class="sub-title">Данные от сторонних сервисов</h3>
        <ul class="doc-list">
          <li><strong>VK OAuth</strong> — при входе через ВКонтакте мы получаем идентификатор VK и публичное имя. Пароль и личные сообщения VK нам не передаются.</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="section-title">3. Цели обработки данных</h2>
        <ul class="doc-list">
          <li>Идентификация пользователя и обеспечение доступа к Сервису.</li>
          <li>Проведение игровых партий и ведение статистики.</li>
          <li>Обработка платёжных операций и выплат.</li>
          <li>Противодействие мошенничеству, мультиаккаунтингу и читерству.</li>
          <li>Техническая поддержка пользователей.</li>
          <li>Улучшение качества Сервиса на основе агрегированной аналитики.</li>
          <li>Отправка важных уведомлений (только транзакционные письма; рекламные рассылки — с отдельного согласия).</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="section-title">4. Передача данных третьим лицам</h2>
        <p>
          Мы не продаём и не передаём персональные данные третьим лицам в коммерческих целях.
          Ограниченная передача данных осуществляется только в следующих случаях:
        </p>
        <ul class="doc-list">
          <li>
            <strong>ЮKassa (НКО «ЮМани»)</strong> — платёжный оператор; получает данные,
            необходимые для проведения финансовых операций согласно требованиям 115-ФЗ.
          </li>
          <li>
            <strong>VK OAuth (ВКонтакте)</strong> — обмен токеном при авторизации; VK получает
            информацию о факте входа, но не об игровых действиях.
          </li>
          <li>
            <strong>Хостинг-провайдер</strong> — технический доступ к данным в рамках обслуживания серверной инфраструктуры.
          </li>
          <li>
            <strong>Государственные органы</strong> — по законному требованию в соответствии с законодательством Российской Федерации.
          </li>
        </ul>
      </section>

      <section class="section">
        <h2 class="section-title">5. Хранение и защита данных</h2>
        <p>
          Данные хранятся на серверах, расположенных на территории Российской Федерации,
          в соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных».
        </p>
        <p>
          Мы применяем технические и организационные меры защиты: шифрование данных в транзите
          (TLS), хэширование паролей (bcrypt), ограничение доступа к базам данных.
        </p>
        <p>
          Данные удалённых аккаунтов хранятся 90 дней (на случай восстановления), после чего
          необратимо уничтожаются, за исключением данных, обязательных к хранению по закону
          (финансовые записи — 5 лет).
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">6. Права пользователя</h2>
        <p>В соответствии с 152-ФЗ вы имеете право:</p>
        <ul class="doc-list">
          <li>Получить информацию о хранящихся данных и целях их обработки.</li>
          <li>Исправить неточные или устаревшие данные в настройках профиля.</li>
          <li>Потребовать удаления данных (право на забвение) — запрос обрабатывается в течение 30 дней.</li>
          <li>Отозвать согласие на обработку данных (за исключением данных, обязательных по закону).</li>
          <li>Подать жалобу в Роскомнадзор, если вы считаете, что ваши права нарушены.</li>
        </ul>
        <p>
          Для реализации прав обратитесь на
          <a href="mailto:privacy@monopolis.ru" class="link">privacy@monopolis.ru</a>.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">7. Cookies</h2>
        <p>
          Сервис использует cookies для работы сессий аутентификации и пользовательских настроек.
          Аналитические cookies применяются только в агрегированном, обезличенном виде.
          Вы можете отключить cookies в настройках браузера, однако это может нарушить работу Сервиса.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">8. Изменения политики</h2>
        <p>
          Мы оставляем за собой право обновлять настоящую Политику. О существенных изменениях
          пользователи будут уведомлены по email не менее чем за 7 дней до их вступления в силу.
          Актуальная версия всегда доступна по адресу <strong>monopolis.ru/privacy</strong>.
        </p>
      </section>

      <section class="section">
        <h2 class="section-title">9. Контактные данные</h2>
        <p>
          Вопросы, связанные с обработкой персональных данных, направляйте по адресу:<br>
          <a href="mailto:privacy@monopolis.ru" class="link">privacy@monopolis.ru</a>
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Политика конфиденциальности — Монополис',
  meta: [{ name: 'description', content: 'Политика конфиденциальности сервиса Монополис: какие данные собираем, как используем и как защищаем.' }],
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
  margin-bottom: $space-sm;
}

.updated {
  font-family: $font-sans;
  font-size: $text-label;
  color: $ivory-muted;
  letter-spacing: 1px;
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

.sub-title {
  font-family: $font-serif;
  font-size: $text-subhead;
  color: $ivory;
  margin: $space-md 0 $space-sm;
}

.doc-list {
  padding-left: $space-lg;
  margin: 0 0 $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  li {
    font-family: $font-sans;
    font-size: $text-body;
    line-height: 1.7;
    color: $ivory;
  }

  strong { color: $gold-light; }
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
