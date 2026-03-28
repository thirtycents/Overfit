<template>
  <main class="app-shell">
    <section class="hero-card">
      <p class="eyebrow">重构脚手架已就绪</p>
      <h1>新的 Vite + Vue 3 + TypeScript 严格模式入口已启动</h1>
      <p class="body-copy">静态 JSON 资源将继续通过 <code>public/</code> 目录按原路径提供，后续任务再接入真实页面逻辑。</p>
    </section>
  </main>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.hero-card {
  width: min(100%, 48rem);
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: #4f46e5;
  font-weight: 700;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 3vw, 2.75rem);
  line-height: 1.2;
  color: #0f172a;
}

.body-copy {
  margin: 0;
  color: #334155;
  line-height: 1.7;
}

code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
</style>
