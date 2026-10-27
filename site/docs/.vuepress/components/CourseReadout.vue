<template>
  <p class="site-visit-counter">
    <span class="site-visit-live"><i aria-hidden="true"/>开放课程</span>
    <span class="site-visit-item">学习模块 <strong>12</strong></span>
    <span class="site-visit-item">完整课程 <strong>72</strong></span>
  </p>
</template>
<style scoped>
.site-visit-counter { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:.4rem .75rem; min-height:1.6rem; margin:0 0 1.75rem; color:var(--vp-c-text-mute); font-size:.86rem !important; line-height:1.5; }
.site-visit-live { display:inline-flex; align-items:center; gap:.38rem; border:1px solid color-mix(in srgb,var(--vp-c-accent) 40%,var(--vp-c-border)); border-radius:999px; padding:.16rem .58rem; color:var(--vp-c-accent); font-size:.78rem; font-weight:800; background:var(--vp-c-accent-soft); }
.site-visit-live i { width:.38rem; height:.38rem; border-radius:50%; background:currentcolor; }
.site-visit-item { display:inline-flex; align-items:baseline; gap:.3rem; }
.site-visit-item + .site-visit-item::before { content:'·'; margin-inline-end:.3rem; color:var(--vp-c-border); }
.site-visit-item strong { color:var(--vp-c-text); font-variant-numeric:tabular-nums; font-weight:750; }
</style>
