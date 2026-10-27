<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { modules } from '../course-data.js';
const state=ref<Record<string,{done?:boolean}>>({});
onMounted(()=>{try{state.value=JSON.parse(localStorage.getItem('route-classroom-progress')||'{}');}catch{}});
const total=computed(()=>modules.flatMap(m=>m.lessons).filter(l=>state.value[l.id]?.done).length);
</script>
<template>
  <div class="proxy-overview"><p class="proxy-progress-total"><strong>{{total}}</strong> / 72 课已读</p><progress :value="total" max="72" aria-label="已读课程比例"/>
    <section v-for="module in modules" :key="module.id"><h2>{{module.title}}</h2><ul><li v-for="lesson in module.lessons" :key="lesson.id"><RouteLink :to="'/lessons/'+lesson.id+'.html'"><span>{{state[lesson.id]?.done?'✓':'○'}}</span> {{lesson.title}}</RouteLink></li></ul></section>
  </div>
</template>
