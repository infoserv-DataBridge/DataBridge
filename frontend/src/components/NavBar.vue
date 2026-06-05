<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">⬡</span> DataBridge
      </RouterLink>
      <div class="nav-links">
        <RouterLink to="/">Importer</RouterLink>
        <RouterLink to="/imports">Mes imports</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar { background: #1e293b; color: #fff; }
.navbar-inner { max-width: 1100px; margin: 0 auto; padding: 0 20px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
.logo { color: #fff; font-weight: 700; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; text-decoration: none; }
.logo-icon { color: #60a5fa; font-size: 1.4rem; }
.nav-links { display: flex; gap: 24px; }
.nav-links a { color: #94a3b8; font-size: .95rem; text-decoration: none; transition: color .15s; }
.nav-links a:hover, .nav-links a.router-link-active { color: #fff; }
</style>
