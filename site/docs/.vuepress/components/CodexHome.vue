<script setup lang="ts">
import { withBase } from 'vuepress/client';
import MiniCaseArt from "./MiniCaseArt.vue";
import HeroWorkbench from "./HeroWorkbench.vue";
import CourseReadout from "./CourseReadout.vue";

import { computed, onMounted, onUnmounted, ref } from "vue";

const active = ref(0);
const typedStarted = ref(false);
const typedCopy = {
  title: "快速上手",
  subtitle: "完成你的第一次连接",
  body: "从资源准备到完成首次连接，一步步看懂请求的路径。",
};
const cases = [
  {
    "tab": "首次连接",
    "title": "从准备材料，\n到第一次连接",
    "description": "选一台设备和一种客户端，导入配置，检查请求记录、出口和目标访问，让每一步都有依据。",
    "link": "/lessons/1-4.html",
    "label": "FIRST CONNECTION",
    "image": "/images/showcase-presentation-v1.webp",
    "headline": "START\n& CONNECT",
    "caption": "让每一次连接，都有清楚的路径。",
    "steps": [
      "准备材料",
      "导入配置",
      "核对记录",
      "恢复网络"
    ]
  },
  {
    "tab": "链式代理",
    "title": "分清前置，\n看见最终出口",
    "description": "理解设备、前置代理与落地出口的职责，用 dialer-proxy 组织链路，再用连接记录验证实际顺序。",
    "link": "/lessons/7-2.html",
    "label": "PROXY CHAIN",
    "image": "/images/showcase-website-v1.webp",
    "headline": "TRACE\nYOUR ROUTE",
    "caption": "从设备出发，把每一跳串起来。",
    "steps": [
      "明确角色",
      "前置拨号",
      "落地出口",
      "逐层验证"
    ]
  },
  {
    "tab": "分流规则",
    "title": "让每个请求，\n走向预期的路径",
    "description": "区分精确域名、后缀和兜底规则，理解从上到下的命中顺序，先在交互实验里验证你的判断。",
    "link": "/lessons/8-4.html",
    "label": "ROUTING RULES",
    "image": "/images/showcase-knowledge-v1.webp",
    "headline": "MATCH\n& VERIFY",
    "caption": "看懂一条规则，也看清它的结果。",
    "steps": [
      "输入域名",
      "按序匹配",
      "选择策略",
      "核对结果"
    ]
  }
];
const stepCaptions = [["整理你的资源","让配置就位","留下连接依据","随时回到原点"],["画出逻辑路径","先连上前置","确认最终出口","让证据说话"],["从一个请求开始","第一条命中生效","找到目标策略","回到连接记录"]];
const current = computed(() => cases[active.value]);
const root = ref<HTMLElement>();
let scrollFrame = 0;
let resizeObserver: ResizeObserver | undefined;
let animatedSections: Record<string, HTMLElement | null> = {};
let motionQuery: MediaQueryList | undefined;
let frame = 0;
function move(event: PointerEvent) {
  if (event.pointerType !== "mouse" || motionQuery?.matches || !root.value)
    return;
  cancelAnimationFrame(frame);
  const target = event.currentTarget as HTMLElement;
  const bounds = target.getBoundingClientRect();
  frame = requestAnimationFrame(() => {
    root.value?.style.setProperty(
      "--art-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`,
    );
    root.value?.style.setProperty(
      "--art-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * 8}px`,
    );
  });
}
function reset() {
  cancelAnimationFrame(frame);
  root.value?.style.setProperty("--art-x", "0px");
  root.value?.style.setProperty("--art-y", "0px");
}
const clamp = (value: number) => Math.max(0, Math.min(1, value));
function updateScene() {
  scrollFrame = 0;
  if (!root.value) return;
  const reduced = motionQuery?.matches ?? false;
  const mobile = window.innerWidth <= 760;
  root.value.classList.toggle("cg-motion", !reduced);
  const height = window.innerHeight;
  const stage = root.value.querySelector<HTMLElement>(".cg-learning-stage");
  const stageFits = !!stage && stage.offsetHeight + 150 < height;
  const cinematic = window.innerWidth >= 1000 && height >= 760 && stageFits;
  root.value.classList.toggle("cg-sticky-ready", cinematic && !reduced);
  const hero = animatedSections.hero?.getBoundingClientRect();
  const learning = animatedSections.learning?.getBoundingClientRect();
  const showcase = animatedSections.showcase?.getBoundingClientRect();
  const community = animatedSections.community?.getBoundingClientRect();
  const set = (name: string, value: number) =>
    root.value?.style.setProperty(name, value.toFixed(4));
  set(
    "--hero-progress",
    reduced || mobile || !hero ? 0 : clamp(-hero.top / hero.height),
  );
  set(
    "--route-progress",
    reduced || !learning
      ? 1
      : clamp(
          (height * (cinematic ? 0.4 : 0.92) - learning.top) /
            (height * (mobile ? 0.45 : cinematic ? 0.85 : 0.8)),
        ),
  );
  const routeProgress = Number(
    root.value.style.getPropertyValue("--route-progress"),
  );
  const terminal = root.value
    .querySelector(".cg-ticket-start")
    ?.getBoundingClientRect();
  if (
    reduced ||
    (routeProgress > 0.85 &&
      terminal &&
      terminal.top < height * 0.9 &&
      terminal.bottom > 100)
  )
    typedStarted.value = true;
  set(
    "--show-progress",
    reduced || !showcase
      ? 1
      : clamp((height * 0.95 - showcase.top) / (height * 0.65)),
  );
  set(
    "--community-progress",
    reduced || !community
      ? 1
      : clamp(
          (height - community.top) /
            Math.min(height * 0.62, community.height * 0.8),
        ),
  );
  set(
    "--ribbon-progress",
    reduced || mobile || !learning ? 0 : (height - learning.top) / height,
  );
}
function queueScene() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScene);
}
function hideDeparting(element: Element) {
  element.setAttribute("aria-hidden", "true");
}
onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  animatedSections = {
    hero: root.value?.querySelector(".cg-hero") ?? null,
    learning: root.value?.querySelector(".cg-learning") ?? null,
    showcase: root.value?.querySelector(".cg-showcase") ?? null,
    community: root.value?.querySelector(".cg-community") ?? null,
  };
  window.addEventListener("scroll", queueScene, { passive: true });
  window.addEventListener("resize", queueScene);
  motionQuery.addEventListener("change", queueScene);
  if ("ResizeObserver" in window && root.value) {
    resizeObserver = new ResizeObserver(queueScene);
    resizeObserver.observe(root.value);
  }
  updateScene();
});
onUnmounted(() => {
  window.removeEventListener("scroll", queueScene);
  window.removeEventListener("resize", queueScene);
  motionQuery?.removeEventListener("change", queueScene);
  resizeObserver?.disconnect();
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(frame);
});
</script>

<template>
  <div ref="root" class="cg-home" :class="{ 'cg-type-running': typedStarted }">
    <section
      class="cg-hero"
      aria-labelledby="main-title"
      @pointermove="move"
      @pointerleave="reset"
    >
      <div class="cg-backdrop-word" aria-hidden="true">PROXY</div>
      <div class="cg-hero-inner">
        <div class="cg-hero-copy">
          <p class="cg-eyebrow">
            <span class="cg-status-dot" /> PROXY GUIDE · 从入门到实战
          </p>
          <h1 id="main-title" class="cg-daily-title">
            <span>让网络请求</span><span>走向预期的</span
            ><span class="cg-title-mark"
              >每一个目的地<svg viewBox="0 0 440 24" aria-hidden="true">
                <path d="M4 13Q165 0 431 9M60 21Q225 8 410 16" /></svg
            ></span>
          </h1>
          <p class="cg-intro">
            从第一次连接开始，<br class="cg-mobile-break" />把每一段
            路径看清楚。
          </p>
          <div class="cg-actions">
            <RouteLink class="cg-button" to="/lessons/1-1.html"
              >开始第一次连接 <span aria-hidden="true">↗</span></RouteLink
            >
            <RouteLink class="cg-button cg-button-outline" to="/recipes/"
              >探索实战案例 <span aria-hidden="true">↗</span></RouteLink
            >
          </div>
          <div class="cg-benefits" aria-label="探索路由课">
            <RouteLink class="cg-benefit-chip" to="/guide/"
              ><span class="cg-benefit-symbol" aria-hidden="true"
                ><svg viewBox="0 0 200 56">
                  <path d="M12 35H60L80 14H123L145 35H187" />
                  <circle cx="12" cy="35" r="6" />
                  <circle cx="81" cy="14" r="6" />
                  <circle cx="145" cy="35" r="6" />
                  <path d="m178 26 10 9-10 9" /></svg></span
              ><span
                ><small>WORKFLOW</small><strong>更清楚的请求路径</strong
                ><em>从连接到理解</em></span
              ><b aria-hidden="true">↗</b></RouteLink
            >
            <RouteLink class="cg-benefit-chip" to="/recipes/"
              ><span class="cg-benefit-symbol" aria-hidden="true"
                ><svg viewBox="0 0 200 56">
                  <rect x="32" y="3" width="133" height="50" rx="5" />
                  <path
                    d="M32 14H165M40 9H43M48 9H51M78 25 66 34 78 43M119 25 131 34 119 43M103 22 94 46"
                  /></svg></span
              ><span
                ><small>PLAYGROUND</small><strong>真实的实战场景</strong
                ><em>学了就能用</em></span
              ><b aria-hidden="true">↗</b></RouteLink
            >
            <RouteLink
              class="cg-benefit-chip"
              to="/about/"
              ><span class="cg-benefit-symbol" aria-hidden="true"
                ><svg viewBox="0 0 200 56">
                  <path d="M70 48H52V8H118V17M63 19H101M63 28H91M63 37H85" />
                  <path
                    d="M105 34a18 18 0 1 0 18-18"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path d="M123 23V34L132 39" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><circle cx="123" cy="34" r="1.5" /></svg></span
              ><span
                ><small>ALWAYS FRESH</small><strong>持续更新的内容</strong
                ><em>有依据，再下结论</em></span
              ><b aria-hidden="true">↗</b></RouteLink
            >
          </div>
          <CourseReadout />
        </div>
        <HeroWorkbench />
      </div>
      <div class="cg-hero-foot">
        <span>LEARN. BUILD. SHARE.</span><a href="#learning"
          >探索你的下一步 <span aria-hidden="true">↓</span></a
        >
      </div>
    </section>

    <div class="cg-ribbon" aria-hidden="true">
      <div class="cg-marquee-track">
        <div v-for="copy in 2" :key="copy" class="cg-marquee-group">
          <template v-for="phrase in 2" :key="phrase">
            <span>MAKE SOMETHING REAL</span><b>✳</b>
          </template>
        </div>
      </div>
    </div>

    <section
      id="learning"
      class="cg-section cg-learning cg-reveal"
      aria-labelledby="cg-learning-title"
    >
      <div class="cg-learning-stage">
        <span class="cg-stage-caption" aria-hidden="true"
          >YOUR NEXT MOVE ↙</span
        >
        <div class="cg-section-heading">
          <div>
            <p class="cg-eyebrow">PICK YOUR NEXT ADVENTURE</p>
            <h2 id="cg-learning-title">今天，想探索什么？</h2>
          </div>
          <p>打开一个入口，<br />带走一个新本领。</p>
        </div>
        <div class="cg-tickets">
          <RouteLink to="/start/" class="cg-ticket cg-ticket-start">
            <div class="cg-ticket-top">
              <span class="cg-window-dots" aria-hidden="true"
                ><i /><i /><i /></span
              ><small>HELLO, PROXY</small>
            </div>
            <h3 class="cg-type-line" :aria-label="typedCopy.title">
              <span
                v-for="(char, i) in Array.from(typedCopy.title)"
                :key="i"
                aria-hidden="true"
                :style="{ '--char': i }"
                >{{ char }}</span
              >
            </h3>
            <strong class="cg-type-line" :aria-label="typedCopy.subtitle"
              ><span
                v-for="(char, i) in Array.from(typedCopy.subtitle)"
                :key="i"
                aria-hidden="true"
                :style="{ '--char': i + 4 }"
                >{{ char }}</span
              ></strong
            >
            <p class="cg-type-line" :aria-label="typedCopy.body">
              <template
                v-for="(char, i) in Array.from(typedCopy.body)"
                :key="i"
              >
                <span aria-hidden="true" :style="{ '--char': i + 16 }">{{
                  char
                }}</span
                ><br v-if="char === '，'" aria-hidden="true" />
              </template>
            </p>
            <div class="cg-ticket-art cg-terminal" aria-hidden="true">
              <span>&gt;_</span><i />
            </div>
            <div class="cg-ticket-bottom">
              <small>开始你的第一次连接</small
              ><span class="cg-round-arrow" aria-hidden="true">↗</span>
            </div>
          </RouteLink>
          <RouteLink to="/advanced/" class="cg-ticket cg-ticket-build">
            <div class="cg-ticket-top">
              <span class="cg-notebook-tab" aria-hidden="true">✳</span
              ><small>FIELD NOTES</small>
            </div>
            <h3>进阶教程</h3>
            <strong>理解可验证的网络路径</strong>
            <p>
              掌握链式代理、DNS 与分流规则，<br />让每次配置都有据可查。
            </p>
            <div class="cg-ticket-art cg-nodes" aria-hidden="true">
              <svg viewBox="0 0 280 125">
                <path d="M45 65L140 35L235 85M140 35L130 110" />
                <circle cx="45" cy="65" r="26" />
                <circle cx="140" cy="35" r="32" />
                <circle cx="235" cy="85" r="25" />
                <circle cx="130" cy="110" r="13" />
                <text x="45" y="73">≡</text>
                <text x="140" y="44">&lt;/&gt;</text>
                <text x="235" y="93">✳</text>
              </svg>
            </div>
            <div class="cg-ticket-bottom">
              <small>翻开配置笔记</small
              ><span class="cg-round-arrow" aria-hidden="true">↗</span>
            </div>
          </RouteLink>
          <RouteLink to="/recipes/" class="cg-ticket cg-ticket-make">
            <div class="cg-ticket-top">
              <span class="cg-poster-star" aria-hidden="true">↗</span
              ><small>BUILT FOR PRACTICE</small>
            </div>
            <h3>实战案例</h3>
            <strong>完成可以核对的实践</strong>
            <p>从真实场景出发，学习完整流程，<br />积累属于你自己的验证记录。</p>
            <div
              class="cg-ticket-art cg-project-illustration"
              aria-hidden="true"
            >
              <img
                :src="withBase('/images/codex-projects-v1.webp')"
                width="900"
                height="600"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="cg-ticket-bottom">
              <small>进入实战课堂</small
              ><span class="cg-round-arrow" aria-hidden="true">↗</span>
            </div>
          </RouteLink>
        </div>
        <RouteLink class="cg-path-link" to="/guide/"
          ><span class="cg-path-symbol" aria-hidden="true">⌘</span>
          <span class="cg-path-copy"
            ><small>FIND YOUR WAY</small
            ><strong>还不知道从哪里开始？</strong></span
          >
          <span class="cg-path-action"
            >阅读完整学习路线 <b aria-hidden="true">↗</b></span
          ></RouteLink
        >
      </div>
    </section>

    <section
      class="cg-section cg-showcase cg-reveal"
      :data-scene="active"
      aria-labelledby="cg-showcase-title"
    >
      <div class="cg-section-heading">
        <div>
          <p class="cg-eyebrow">
            THE MAKING ROOM <span class="cg-live-dot" aria-hidden="true" />
          </p>
          <h2 id="cg-showcase-title">让每次连接，<span>都有迹可循。</span></h2>
        </div>
        <p>
          一次连接、一条链路、一组规则。<br />从这里开始，把配置真正弄明白。
        </p>
      </div>
      <div class="cg-showcase-layout">
        <div class="cg-case-copy">
          <div class="cg-case-tabs" role="group" aria-label="选择实战案例">
            <button
              v-for="(item, index) in cases"
              :key="item.tab"
              type="button"
              :aria-pressed="active === index"
              @click="active = index"
            >
              {{ item.tab }}
            </button>
          </div>
          <div
            aria-live="polite"
            aria-atomic="true"
            class="cg-case-description"
            :key="active"
          >
            <h3>{{ current.title }}</h3>
            <p>{{ current.description }}</p>
          </div>
          <RouteLink :to="current.link" class="cg-button"
            >查看完整步骤 <span aria-hidden="true">↗</span></RouteLink
          >
        </div>
        <div class="cg-preview-stage">
          <Transition name="cg-scene" @before-leave="hideDeparting">
            <div
              :key="active"
              :data-case="active"
              class="cg-preview cg-generated-preview"
              role="img"
              :aria-label="`${current.tab}成果示意：${current.caption}`"
            >
              <div class="cg-mosaic-main">
                <div class="cg-mosaic-label">
                  <span>◈ 路由课</span><span>{{ current.label }}</span>
                </div>
                <strong class="cg-mosaic-headline">{{
                  current.headline
                }}</strong>
                <p>{{ current.caption }}</p>
                <img
                  :src="withBase(current.image)"
                  width="1200"
                  height="800"
                  alt=""
                  decoding="async"
                />
                <small>创意示意 / WORKFLOW PREVIEW</small>
              </div>
              <div class="cg-mosaic-tiles">
                <div
                  v-for="(step, i) in current.steps"
                  :key="step"
                  class="cg-mosaic-tile"
                  :style="{ '--tile': i }"
                >
                  <strong>{{ step }}</strong>
                  <MiniCaseArt :scene="active" :tile="i" />
                  <div class="cg-mini-caption">
                    <small>{{ stepCaptions[active][i] }}</small
                    ><span aria-hidden="true">↗</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <section
      class="cg-community cg-reveal"
      aria-labelledby="cg-community-title"
    >
      <div class="cg-community-inner">
        <p class="cg-eyebrow">一步一步，学以致用</p>
        <h2 id="cg-community-title">
          <span>让每一次认真学习</span><span class="cg-community-highlight">都有清楚的结果<svg viewBox="0 0 500 24" aria-hidden="true"><path d="M4 14Q220 1 494 9M60 22Q260 9 466 18" /></svg></span>
        </h2>
        <div class="cg-community-details">
          <div class="cg-community-copy">
            <p class="cg-community-intro">从首次连接到链式代理，从规则命中到出口验证。用逐章课程理解原理，用交互实验观察路径，再回到客户端记录核对结果。<br />所有课程开放阅读，不设置广告或推广链接。</p>
            <div class="cg-community-capacity"><strong>12 个模块，72 课循序渐进</strong><span>电脑与手机分别说明，配置语法按客户端独立维护。</span></div>
            <ul class="cg-community-perks">
              <li>从现有资源出发，完成第一次连接</li>
              <li>用交互实验看懂链路与规则命中</li>
              <li>分别核对配置、连接、出口与目标访问</li>
              <li>把排查过程留下，保留恢复与回退方式</li>
            </ul>
            <div class="cg-community-actions">
              <RouteLink class="cg-button cg-button-mint" to="/courses/">打开全部课程 <span aria-hidden="true">↗</span></RouteLink>
              <RouteLink class="cg-button cg-community-secondary" to="/labs/">进入交互实验 <span aria-hidden="true">↗</span></RouteLink>
            </div>
            <p class="cg-community-note">开放阅读 · 学习记录保存在当前浏览器</p>
          </div>
          <aside class="cg-community-reader">
            <span class="cg-reader-seal" aria-hidden="true">↗</span>
            <p class="cg-eyebrow">适合这些读者</p>
            <h3>你希望把代理配置，从能用变成理解</h3>
            <ul><li>手上有订阅、节点或服务器资源</li><li>愿意动手观察规则与连接记录</li><li>希望能独立判断问题并恢复网络</li></ul>
            <RouteLink to="/courses/">查看完整介绍 <span aria-hidden="true">↗</span></RouteLink>
          </aside>
        </div>
        <div class="cg-wordmark" aria-hidden="true">
          <div class="cg-warp-type">
            <span
              v-for="(letter, index) in 'PROXYGUIDE'"
              :key="index"
              :style="{ '--letter': index }"
              >{{ letter }}</span
            >
          </div>
          <span class="cg-wordmark-caption">LEARN / BUILD / SHARE / GROW</span>
        </div>
      </div>
    </section>
  </div>
</template>
