<script setup lang="ts">
import { computed, ref } from 'vue';
const mode = ref('chain');
const selected = ref('exit');
const input = ref('docs.example.com');
const reversed = ref(false);
const modes = [{id:'direct',name:'直连'},{id:'single',name:'单节点'},{id:'chain',name:'链式代理'}];
const nodes = [{id:'device',name:'你的设备',icon:'⌘',detail:'请求从设备上的应用发出。接管方式决定请求是否进入代理内核。'}, {id:'front',name:'前置代理',icon:'⇄',detail:'前置帮助建立到落地节点的连接。链式路径里，它不是目标网站看到的最终出口。'}, {id:'exit',name:'落地出口',icon:'◎',detail:'落地向目标网站发起最后一段连接，决定网站看到的出口。应结合连接记录与出口检测核对。'}, {id:'site',name:'目标网站',icon:'↗',detail:'网站收到最后一段请求。它能否正常加载，还要独立检查 DNS、TLS 与应用响应。'}];
const active = (id: string) => mode.value === 'chain' || ['device','site'].includes(id) || (mode.value === 'single' && id === 'front');
const route = computed(() => mode.value === 'direct' ? '你的设备 → 目标网站' : mode.value === 'single' ? '你的设备 → 代理节点 → 目标网站' : '你的设备 → 前置代理 → 落地出口 → 目标网站');
const detail = computed(() => {
  const node = nodes.find(n => n.id === selected.value)!;
  if (!active(node.id)) return `当前路径不经过${node.name}。切换到链式代理，可查看完整的逻辑顺序。`;
  if (mode.value === 'single' && node.id === 'front') return '单节点路径中，这个代理同时承担转发与最终出口的角色。';
  return node.detail;
});
const rules = computed(() => reversed.value ? [
  {type:'MATCH',value:'*',policy:'兜底代理'},
  {type:'DOMAIN',value:'docs.example.com',policy:'资料专线'},
  {type:'DOMAIN-SUFFIX',value:'example.com',policy:'落地出口'},
] : [
  {type:'DOMAIN',value:'docs.example.com',policy:'资料专线'},
  {type:'DOMAIN-SUFFIX',value:'example.com',policy:'落地出口'},
  {type:'MATCH',value:'*',policy:'兜底代理'},
]);
const result = computed(() => {
  const domain = input.value.trim().toLowerCase().replace(/\.$/,'');
  if (domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) return {index:-1,rule:null,reason:'请输入域名，例如 docs.example.com；不要包含 https://、端口或路径。'};
  const index = rules.value.findIndex(r => r.type === 'MATCH' || (r.type === 'DOMAIN' ? domain === r.value : domain === r.value || domain.endsWith('.'+r.value)));
  const rule = rules.value[index];
  return {index,rule,reason:rule.type === 'MATCH' ? '前面的规则均未命中，或 MATCH 已被移到首位。按第一条命中的规则选择策略。' : rule.type === 'DOMAIN' ? '域名与精确规则完全一致，因此先于后缀规则命中。' : '域名等于该后缀，或以点号加该后缀结尾。evil-example.com 不属于 example.com。'};
});
</script>

<template>
  <div class="proxy-lab">
    <section class="proxy-path" aria-label="路径教学实验">
      <div class="proxy-lab-header"><span>THE ROUTE LAB / 01</span><span class="proxy-live">本地教学模型</span></div>
      <h2>一条请求，三种路径。</h2>
      <div class="proxy-mode" role="group" aria-label="选择网络路径">
        <button v-for="item in modes" :key="item.id" :aria-pressed="mode === item.id" @click="mode=item.id">{{item.name}}</button>
      </div>
      <div class="proxy-nodes" :data-mode="mode">
        <template v-for="(node,i) in nodes" :key="node.id">
          <span v-if="i" class="proxy-wire" aria-hidden="true">→</span>
          <button class="proxy-node" :class="{inactive:!active(node.id)}" :aria-pressed="selected===node.id" @click="selected=node.id">
            <span>{{node.icon}}</span><strong>{{mode==='single' && node.id==='front'?'代理节点':node.name}}</strong><small>{{active(node.id)?'点击查看职责':'本路径未经过'}}</small>
          </button>
        </template>
      </div>
      <div class="proxy-result" aria-live="polite"><strong>{{route}}</strong><p>{{detail}}</p></div>
    </section>
    <section class="proxy-rule" aria-label="规则命中实验">
      <div class="proxy-lab-header"><span>MATCH & VERIFY / 02</span><span>从上到下，首条命中</span></div>
      <h2>这次请求，会走哪条规则？</h2>
      <label for="proxy-domain">输入示例域名</label>
      <div class="proxy-domain-row"><input id="proxy-domain" v-model="input" type="text" autocomplete="off" spellcheck="false" placeholder="docs.example.com" /><button :aria-pressed="reversed" @click="reversed=!reversed">{{reversed?'恢复规则顺序':'把 MATCH 移到首位'}} ↕</button></div>
      <ol class="proxy-rules"><li v-for="(rule,i) in rules" :key="rule.type" :class="{matched:result.index===i}"><span>{{String(i+1).padStart(2,'0')}}</span><code>{{rule.type}},{{rule.value}},{{rule.policy}}</code><b v-if="result.index===i">命中 ↗</b></li></ol>
      <div class="proxy-result" aria-live="polite"><strong>{{result.rule ? result.rule.type+' → '+result.rule.policy : '请检查输入'}}</strong><p>{{result.reason}}</p></div>
    </section>
    <p class="proxy-caption">仅演示逻辑路径与规则顺序，不建立真实代理连接、不检测出口、不修改网络设置。</p>
  </div>
</template>
