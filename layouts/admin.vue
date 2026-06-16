<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-logo">МОНОПОЛИС<br>ADMIN</div>
      <nav class="admin-nav">
        <NuxtLink to="/admin" class="admin-nav-link" exact-active-class="active">Дашборд</NuxtLink>
        <NuxtLink to="/admin/users" class="admin-nav-link" active-class="active">Пользователи</NuxtLink>
        <NuxtLink to="/admin/withdrawals" class="admin-nav-link" active-class="active">Выводы</NuxtLink>
        <NuxtLink to="/admin/fraud" class="admin-nav-link" active-class="active">Антифрод</NuxtLink>
      </nav>
    </aside>
    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: $noir;
}

.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: $noir-card;
  border-right: 1px solid $noir-border;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.admin-logo {
  font-family: $font-serif;
  color: $gold;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 0 24px 32px;
  line-height: 1.5;
}

.admin-nav {
  display: flex;
  flex-direction: column;
}

.admin-nav-link {
  display: block;
  padding: 12px 24px;
  color: $ivory-muted;
  text-decoration: none;
  font-family: $font-sans;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-left: 2px solid transparent;
  transition: color $transition-fast, background $transition-fast;

  &.active {
    color: $gold;
    border-left-color: $gold;
    background: rgba($gold, 0.05);
  }

  &:hover:not(.active) {
    color: $ivory;
    background: rgba($ivory, 0.03);
  }
}

.admin-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  color: $ivory;
}
</style>
