<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ section: string }>();
const sections: Record<string, {label:string;intro:string;links:{title:string;detail:string;to:string;icon:string}[]}> = {
  "guide": {
    "label": "CHOOSE YOUR PATH",
    "intro": "从第一次连接，到可以独立维护的配置。选择适合自己的起点，边做边学。",
    "links": [
      {
        "title": "第一次连接",
        "detail": "准备材料，完成连接与恢复",
        "to": "/start/",
        "icon": ">_"
      },
      {
        "title": "理解网络路径",
        "detail": "学会链式代理、DNS 与规则",
        "to": "/advanced/",
        "icon": "⌘"
      },
      {
        "title": "用证据解决问题",
        "detail": "从实战记录到逐层排障",
        "to": "/recipes/",
        "icon": "↗"
      }
    ]
  },
  "start": {
    "label": "HELLO, PROXY",
    "intro": "从现有资源出发。准备工具、导入配置，走完你的第一次完整连接。",
    "links": [
      {
        "title": "准备好工具",
        "detail": "选择设备、客户端与导入材料",
        "to": "/lessons/1-3.html",
        "icon": "↓"
      },
      {
        "title": "完成第一次连接",
        "detail": "从配置导入到连接记录",
        "to": "/lessons/1-4.html",
        "icon": ">_"
      },
      {
        "title": "把结果说清楚",
        "detail": "核对规则、链路、出口与目标访问",
        "to": "/lessons/1-5.html",
        "icon": "↗"
      }
    ]
  },
  "advanced": {
    "label": "BUILD YOUR ROUTE",
    "intro": "让每一条规则、每一段路径都有清楚的解释。把一次可用变成可以验证的配置。",
    "links": [
      {
        "title": "链式代理",
        "detail": "区分前置与最终落地出口",
        "to": "/lessons/7-2.html",
        "icon": "↗"
      },
      {
        "title": "分流规则",
        "detail": "输入、命中、策略与结果",
        "to": "/lessons/8-4.html",
        "icon": "{ }"
      },
      {
        "title": "动手实验",
        "detail": "切换路径，马上看到变化",
        "to": "/labs/",
        "icon": "✳"
      }
    ]
  },
  "recipes": {
    "label": "THE PRACTICE ROOM",
    "intro": "从一个具体现象出发，把假设、过程与证据整理成可以复查的记录。",
    "links": [
      {
        "title": "综合案例",
        "detail": "完整记录配置与验证过程",
        "to": "/courses/module-11/",
        "icon": "▤"
      },
      {
        "title": "故障排查",
        "detail": "逐层缩小范围，一次改变一项",
        "to": "/troubleshooting/",
        "icon": "↗"
      },
      {
        "title": "出口检测",
        "detail": "每种检测回答一个具体问题",
        "to": "/tools/",
        "icon": "⌘"
      }
    ]
  }
};
const current = computed(() => sections[props.section] ?? sections.guide);
</script>
<template>
  <section class="cg-section-intro" aria-label="本栏目精选入口">
    <p class="cg-directory-label">
      {{ current.label }} <span aria-hidden="true">✳</span>
    </p>
    <p class="cg-directory-intro">{{ current.intro }}</p>
    <div class="cg-directory-cards">
      <RouteLink v-for="link in current.links" :key="link.title" :to="link.to">
        <span class="cg-directory-icon" aria-hidden="true">{{
          link.icon
        }}</span>
        <strong>{{ link.title }}</strong
        ><small>{{ link.detail }}</small
        ><b aria-hidden="true">↗</b>
      </RouteLink>
    </div>
  </section>
</template>
