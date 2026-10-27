<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
const props=defineProps<{lessonId:string;checks:string[]}>();
const checked=ref<boolean[]>([]),done=ref(false),ready=ref(false);
const load=()=>{
  ready.value=false;
  try {
    const state=JSON.parse(localStorage.getItem('route-classroom-progress')||'{}');
    checked.value=props.checks.map((_,i)=>!!state[props.lessonId]?.checks?.[i]);
    done.value=!!state[props.lessonId]?.done;
  } catch { checked.value=props.checks.map(()=>false); done.value=false; }
  ready.value=true;
};
const save=()=>{
  if(!ready.value)return;
  try {const state=JSON.parse(localStorage.getItem('route-classroom-progress')||'{}');state[props.lessonId]={checks:checked.value,done:done.value};localStorage.setItem('route-classroom-progress',JSON.stringify(state));} catch { storageMessage.value='当前浏览器无法保存进度，本次勾选仍可使用。'; }
};
const storageMessage=ref('');
onMounted(load);
watch(()=>props.lessonId,load);
watch([checked,done],save,{deep:true});
</script>
<template>
  <div class="proxy-progress">
    <label v-for="(text,i) in checks" :key="text"><input v-model="checked[i]" type="checkbox" /><span>{{text}}</span></label>
    <button class="proxy-done" :aria-pressed="done" @click="done=!done">{{done?'✓ 已读本课 · 点击撤销':'标记本课已读 ↗'}}</button>
    <p v-if="storageMessage" role="status">{{storageMessage}}</p>
  </div>
</template>
