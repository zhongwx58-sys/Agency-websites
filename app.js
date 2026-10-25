'use strict';

const modules = [...(window.COURSE_PART_A || []), ...(window.COURSE_PART_B || [])];
const lessons = modules.flatMap(module => module.lessons.map(lesson => ({ ...lesson, module })));
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const paths = {
  route:'M4 19V5h8a6 6 0 0 1 0 12h-1l8 5M4 11h8',
  arrow:'M4 12h15m-6-6 6 6-6 6',
  chevron:'m9 5 7 7-7 7',
  search:'m20 20-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  book:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zm9 2v16',
  shield:'m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6zm-4 9 3 3 5-6',
  monitor:'M3 4h18v13H3zm9 13v4m-5 0h10',
  server:'M4 3h16v7H4zm0 11h16v7H4zM7 6h.1M7 17h.1m4-11h6m-6 11h6',
  globe:'M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0M3 12h18M12 3c5 6 5 12 0 18-5-6-5-12 0-18',
  check:'m5 12 4 4L19 6',
  menu:'M4 6h16M4 12h16M4 18h16',
  close:'m5 5 14 14M5 19 19 5',
  windows:'m3 5 8-1v7H3zm10-1 8-1v8h-8zM3 13h8v7l-8-1zm10 0h8v8l-8-1z',
  apple:'M15 3c0 2-2 3-3 3 0-2 1-3 3-3M12 8C6 4 2 10 5 16s5 6 7 4c2 2 5 2 7-3-3-2-3-5 0-7-3-4-5-3-7-2',
  android:'m7 4-2-2m12 2 2-2M5 9a7 7 0 0 1 14 0zm0 2h14v8H5zM8 19v3m8-3v3M2 11v6m20-6v6M8 6h.1M16 6h.1',
  phone:'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m2 3h6m-4 14h2',
  code:'m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
  external:'M14 3h7v7m0-7L10 14m0-10H3v17h17v-7',
  layers:'m12 2 10 5-10 5L2 7zm-10 10 10 5 10-5M2 17l10 5 10-5',
  tool:'m14 6 4 4 4-4c1 6-3 9-7 7L6 22l-4-4 9-9C9 5 12 1 18 2z',
  lock:'M5 10h14v11H5zm3 0V6a4 4 0 0 1 8 0v4m-4 5v2',
  clock:'M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0M12 6v6l4 2'
};
function icon(name, cls='') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`; }
function readSaved(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
let completed = readSaved('route-classroom-completed-v1', []);
if (!Array.isArray(completed)) completed = [];
completed = completed.filter(id => lessons.some(lesson => lesson.id === id));
let checks = readSaved('route-classroom-checks-v1', {});
if (!checks || typeof checks !== 'object' || Array.isArray(checks)) checks = {};
let lastLesson = readSaved('route-classroom-last-v1', '1-1');
if (!lessons.some(lesson => lesson.id === lastLesson)) lastLesson = '1-1';
let networkMode = 'chain';
let selectedNode = null;
let feature = 'chain';
let toastTimer;
let activeLesson = null;
const rules = [
  { type:'DOMAIN', value:'internal.example.com', target:'DIRECT', explanation:'精确域名匹配，使用直连。' },
  { type:'DOMAIN-SUFFIX', value:'example.com', target:'指定出口', explanation:'匹配 example.com 本身及其子域名，使用指定出口。' },
  { type:'MATCH', value:'', target:'默认代理', explanation:'前面的规则均未命中时，使用默认代理。' }
];
function persist(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast('浏览器未允许保存，本次进度仅在当前页面有效。'); return false; } }
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
const courseURL = id => `#/course/${id}`;
const continueURL = () => courseURL(lastLesson);
function brand() { return `<a class="brand" href="#/" aria-label="路由课首页"><span class="brand-mark">${icon('route')}</span>路由课<span class="brand-en">Proxy Guide</span></a>`; }
function header(route) {
  $('#header').innerHTML = `<div class="container nav-wrap">${brand()}<nav class="nav-links" id="nav-links" aria-label="主导航">${[['courses','课程目录'],['clients','客户端指南'],['labs','交互实验'],['troubleshooting','故障排查']].map(([path,title])=>`<a class="${route === path || (path === 'courses' && route === 'course') ? 'active' : ''}" href="#/${path}">${title}</a>`).join('')}</nav><div class="nav-actions"><button class="search-trigger" data-action="search" aria-label="搜索课程">${icon('search')}<span>搜索</span><kbd>Ctrl K</kbd></button><a class="button primary" href="${continueURL()}">${completed.length ? '继续学习' : '开始学习'} ${icon('arrow')}</a><button class="icon-button mobile-toggle" data-action="mobile-nav" aria-controls="nav-links" aria-expanded="false" aria-label="打开导航">${icon('menu')}</button></div></div>`;
}
function footer() {
  $('#footer').innerHTML = `<div class="container"><div class="footer-top"><div class="footer-brand">${brand()}<p>把每一次连接，变成一次理解。<br>从零开始，学会配置、验证与排错。</p></div><div class="footer-col"><h3>按路径学习</h3><a href="${courseURL('1-1')}">从零开始</a><a href="#/courses">完整课程目录</a><a href="#/clients">客户端指南</a></div><div class="footer-col"><h3>动手与验证</h3><a href="#/labs">交互实验</a><a href="#/tools">IP 检测工具</a><a href="#/troubleshooting">故障排查</a></div><div class="footer-col"><h3>关于路由课</h3><a href="#/about">内容与来源</a><a href="#/about">无广告原则</a><a href="assets/mihomo-chain.example.yaml" download>下载链式配置示例</a></div></div><div class="footer-bottom"><span>路由课 · 独立、无广告的网络学习手册</span><span>内容初版 · 2026.10.25　学习进度仅保存在本机</span></div></div>`;
}
const nodeInfo = {
  device:['你的设备','应用发起请求。客户端决定是否接管这次连接。'],
  front:['前置代理','先连接可到达的前置节点，再由它建立到落地出口的连接。'],
  exit:['落地出口','最终向目标网站发起连接的节点；目标通常看到这一跳的出口 IP。'],
  site:['目标网站','接收请求并返回响应。路径正确和网站能否正常使用，需要分别检查。']
};
function networkDiagram() {
  const modes = { direct:['直连','设备直接访问目标网站，不经过图中的代理节点。'], single:['单节点代理','设备经一个代理节点访问网站；该节点同时承担最终出口。'], chain:['链式代理','设备 → 前置代理 → 落地出口 → 目标网站。'] };
  const routePath = { direct:'M100 167C200 167 285 235 430 235', single:'M100 167C138 167 132 83 202 83L275 83C365 83 340 235 430 235', chain:'M100 167C140 167 130 83 202 83L275 83C348 83 290 235 360 235H430' };
  const nodes = [ ['device',38,136,'monitor','你的设备','请求起点'], ['front',202,52,'server',networkMode==='single'?'代理节点':'前置代理','第一跳'], ['exit',300,204,'globe','落地出口','最终出口'], ['site',430,204,'globe','目标网站','访问目标'] ];
  const node = ([key,x,y,name,label,detail]) => {
    const inactive = (networkMode === 'direct' && ['front','exit'].includes(key)) || (networkMode === 'single' && key === 'exit');
    return `<g class="node ${inactive?'inactive':'active'}" transform="translate(${x} ${y})" data-action="node" data-node="${key}" role="button" tabindex="0" aria-label="了解${label}"><rect width="62" height="62" rx="13"/><svg x="19" y="19" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${key==='exit'?'#315eae':'#454b54'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]}"/></svg><text x="31" y="83" text-anchor="middle">${label}</text><text class="node-label" x="31" y="102" text-anchor="middle">${detail}</text></g>`;
  };
  const info = selectedNode ? nodeInfo[selectedNode] : modes[networkMode];
  return `<div class="network-card"><div class="network-top"><strong>一次请求的旅程</strong><span class="tag">教学示意 · 非真实连接</span></div><div class="segmented" role="tablist" aria-label="选择网络路径">${Object.entries(modes).map(([key,value])=>`<button role="tab" data-action="network-mode" data-mode="${key}" aria-selected="${networkMode===key}">${value[0].replace('代理','')}</button>`).join('')}</div><div class="network-canvas"><svg class="network-svg" viewBox="0 0 530 335" role="group" aria-label="网络路径教学图，点击节点查看说明"><defs><pattern id="grid" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#d9d9e2"/></pattern></defs><rect x="8" y="0" width="514" height="318" fill="url(#grid)"/><path class="inactive-line" d="M100 167C140 167 130 83 202 83L275 83C348 83 290 235 360 235H430"/><path class="route-line" d="${routePath[networkMode]}"/>${nodes.map(node).join('')}<text x="410" y="53" text-anchor="middle" style="font-size:10px;fill:#757984">点击节点，理解每一跳</text></svg></div><div class="network-bottom" aria-live="polite"><b>${escapeHTML(info[0])}</b>${escapeHTML(info[1])}</div></div>`;
}
function home() {
  return `<div class="container"><section class="hero"><div class="hero-copy"><div class="eyebrow">从零基础到进阶的网络学习手册</div><h1>从第一次连接，<br>到看懂每一条规则。</h1><p>从代理基础、客户端设置到链式代理、DNS 与分流，循序渐进地理解原理、完成配置，并学会验证结果。</p><div class="hero-actions"><a class="button primary" href="${continueURL()}">${completed.length?'继续学习':'开始第一课'} ${icon('arrow')}</a><a class="text-link" href="#/courses">浏览全部课程 ${icon('chevron')}</a></div><div class="hero-note">${icon('shield')}无广告 · 无推广链接 · 无需注册</div></div><div id="hero-network">${networkDiagram()}</div></section><div class="platform-strip"><span>选择你的设备，找到适合的起点</span>${[['windows','Windows'],['apple','macOS'],['android','Android'],['phone','iOS']].map(([key,title])=>`<a href="#/clients">${icon(key)}${title}</a>`).join('')}</div><section class="section"><div class="section-head"><div><h2>一步一步，搭起你的知识地图。</h2><p>12 个模块，72 个课题。从一条连接开始，逐渐理解整个网络。</p></div><a class="text-link" href="#/courses">查看课程目录 ${icon('arrow')}</a></div><div class="path-grid">${[
    ['01','零基础入门','认识客户端、节点与订阅，完成第一次连接和结果检查。','模块 01–02','1-1','book'],
    ['02','客户端与出口','找到适合设备的操作路线，分清 VPS、住宅与 ISP 出口。','模块 03–05','3-1','monitor'],
    ['03','看懂流量路径','理解 TUN 与 DNS，连接前置和落地，让规则安排请求。','模块 06–08','6-1','route'],
    ['04','验证与持续维护','交叉核对出口信息，维护配置，用证据定位常见问题。','模块 09–12','9-1','shield']
  ].map(([n,title,desc,range,id,ic])=>`<a class="path-card" href="${courseURL(id)}"><div class="path-number"><span>学习阶段 ${n}</span>${icon(ic)}</div><h3>${title}</h3><p>${desc}</p><div class="path-bottom"><span>${range}</span>${icon('arrow')}</div></a>`).join('')}</div></section></div><section class="section feature-section"><div class="container feature-layout"><div class="feature-copy"><h2>复杂的配置，<br>从一张图开始理解。</h2><p>切换路径、调整规则，观察一次请求如何抵达目标。先看懂，再动手。</p><div class="feature-tabs" role="tablist" aria-label="核心专题">${[['chain','链式代理'],['rules','分流规则'],['dns','DNS 与 TUN']].map(([key,title])=>`<button class="feature-tab" role="tab" aria-selected="${feature===key}" data-action="feature" data-feature="${key}">${title}${icon('arrow')}</button>`).join('')}</div></div><div id="feature-panel">${featurePanel()}</div></div></section><div class="container trust-band"><div>${icon('book')}<h3>学会操作，也理解原因</h3><p>每课包含操作思路、结果检查和恢复方式，帮助你判断配置是否符合预期。</p></div><div>${icon('shield')}<h3>内容独立，绝对无广告</h3><p>没有广告位、赞助排名或返佣链接。工具按用途介绍，来源清晰可查。</p></div><div>${icon('lock')}<h3>按照自己的节奏学习</h3><p>无需账号。阅读进度保存在当前浏览器，随时从上一次的位置继续。</p></div></div>`;
}
function featurePanel() {
  const content = {
    chain: `<div class="feature-panel-top"><h3>让每一跳各司其职</h3><span class="tag blue">链式代理</span></div><div class="mini-flow">${[['monitor','设备'],['server','前置代理'],['globe','落地出口'],['globe','目标网站']].map(([ic,t],i)=>`${i?icon('arrow'):''}<div class="mini-node">${icon(ic)}${t}</div>`).join('')}</div><p>前置负责建立到落地节点的连接，落地负责最终出口。多选两个节点，不等于建立了链式代理。</p><a class="text-link" href="${courseURL('7-2')}">学习前置与落地顺序 ${icon('arrow')}</a>`,
    rules: `<div class="feature-panel-top"><h3>从上往下，第一条命中生效</h3><span class="tag blue">分流规则</span></div><div class="rule-preview">DOMAIN,internal.example.com,DIRECT<br><span class="hit">DOMAIN-SUFFIX,example.com,指定出口</span><br>MATCH,默认代理</div><p>请求 video.example.com 会命中第二条。把兜底移到最前面，又会发生什么？</p><a class="text-link" href="#/labs">动手调整规则顺序 ${icon('arrow')}</a>`,
    dns: `<div class="feature-panel-top"><h3>先找到地址，再建立连接</h3><span class="tag blue">DNS 与 TUN</span></div><div class="mini-flow"><div class="mini-node">${icon('monitor')}应用请求</div>${icon('arrow')}<div class="mini-node">${icon('layers')}流量接管</div>${icon('arrow')}<div class="mini-node">${icon('globe')}解析与连接</div></div><p>系统代理和 TUN 决定如何接管请求，DNS 参与地址解析。浏览器可用，不能说明每个应用的路径都相同。</p><a class="text-link" href="${courseURL('6-1')}">理解接管与解析 ${icon('arrow')}</a>`
  };
  return `<div class="feature-panel" role="tabpanel">${content[feature]}</div>`;
}
function pageIntro(title,description,tag='学习手册') { return `<div class="page-intro"><div class="breadcrumb"><a href="#/">首页</a>${icon('chevron')}<span>${tag}</span></div><h1>${title}</h1><p>${description}</p></div>`; }
function catalog(stage='all') {
  const filtered = modules.filter(module => stage==='all' || (stage==='start' && module.id<=2) || (stage==='client' && module.id>=3 && module.id<=5) || (stage==='network' && module.id>=6 && module.id<=8) || (stage==='practice' && module.id>=9));
  return `<div class="container">${pageIntro('从第一课开始，也可以按需探索。','按 V2 大纲编排的完整学习路径。选择一个模块，先理解目标，再跟随步骤完成检查。','课程目录')}<div class="catalog-bar"><div class="filter-group" aria-label="筛选课程阶段">${[['all','全部课程'],['start','零基础入门'],['client','客户端与出口'],['network','流量路径'],['practice','验证与维护']].map(([key,title])=>`<button class="filter-button" data-action="filter" data-filter="${key}" aria-pressed="${stage===key}">${title}</button>`).join('')}</div><div class="course-progress">已读 ${completed.length} / ${lessons.length} 课 · 本机记录</div></div><div class="notice"><strong>关于这一版内容：</strong>课程由大纲扩写，并参考官方资料整理。客户端逐步实拍图与实际环境复现尚待补齐；“已读”仅记录阅读进度。</div><div class="catalog-grid">${filtered.map(module=>`<section class="module-card"><div class="module-card-head"><div class="module-index">模块 ${String(module.id).padStart(2,'0')} / 6 课</div><h2>${escapeHTML(module.title)}</h2><p>${escapeHTML(module.description)}</p></div><ol class="lesson-list">${module.lessons.map(lesson=>`<li><a href="${courseURL(lesson.id)}"><span class="lesson-num">${lesson.id.replace('-','.')}</span><span>${escapeHTML(lesson.title)}</span>${icon(completed.includes(lesson.id)?'check':'chevron',completed.includes(lesson.id)?'done':'')}</a></li>`).join('')}</ol></section>`).join('')}</div></div>`;
}
function courseSidebar(lesson) { return `<aside class="course-sidebar" id="course-sidebar" aria-label="课程章节"><div class="sidebar-label"><a href="#/courses">全部课程</a><span class="muted small">${completed.length}/${lessons.length}</span></div><div class="progress-track" aria-label="已读 ${completed.length} 课"><span style="width:${completed.length/Math.max(lessons.length,1)*100}%"></span></div>${modules.map(module=>`<details ${module.id===lesson.module.id?'open':''}><summary><span>${String(module.id).padStart(2,'0')}　${escapeHTML(module.title)}</span>${icon('chevron')}</summary><div class="sidebar-lessons">${module.lessons.map(item=>`<a href="${courseURL(item.id)}" class="${item.id===lesson.id?'active':''}" ${item.id===lesson.id?'aria-current="page"':''}><span class="snum">${completed.includes(item.id)?'✓':item.id.replace('-','.')}</span>${escapeHTML(item.title)}</a>`).join('')}</div></details>`).join('')}</aside>`; }
function lessonPage(id) {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) return `<div class="container empty-state"><h1>没有找到这节课</h1><p>从课程目录选择一节课继续。</p><a class="button primary" href="#/courses">返回课程目录</a></div>`;
  activeLesson = lesson;
  lastLesson = id;
  persist('route-classroom-last-v1',id);
  document.title = `${lesson.title} · 路由课`;
  const index = lessons.findIndex(item=>item.id===id);
  const done = completed.includes(id);
  return `<div class="lesson-menu"><button data-action="course-menu" aria-controls="course-sidebar" aria-expanded="false">${icon('menu')}课程章节</button><span>第 ${lesson.id.replace('-','.')} 课</span></div><div class="reading-layout">${courseSidebar(lesson)}<article class="lesson-article"><div class="breadcrumb"><a href="#/courses">课程</a>${icon('chevron')}<span>模块 ${lesson.module.id}</span></div><span class="tag blue">${escapeHTML(lesson.module.title)}</span><h1>${escapeHTML(lesson.title)}</h1><p class="lesson-summary">${escapeHTML(lesson.summary)}</p><div class="lesson-meta"><span>${icon('clock')} 约 ${lesson.minutes || 6} 分钟阅读</span><span>2026.10.25</span><span>资料整理</span></div><div class="notice">本课为大纲扩写与官方资料整理，尚未完成逐客户端实操复现。图解为教学示意；涉及客户端界面的课程，真实步骤截图待补充。请按实际系统与版本核对入口。</div>${lesson.module.id===7 && lesson.id==='7-2'?`<div id="lesson-network">${networkDiagram()}</div>`:''}${lesson.sections.map((section,i)=>`<section class="lesson-section" id="section-${i}"><h2 tabindex="-1">${escapeHTML(section.title)}</h2>${(section.paragraphs||[]).map(p=>`<p>${escapeHTML(p)}</p>`).join('')}${section.steps?.length?`<ol>${section.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ol>`:''}${section.code?`<div class="code-box"><div class="code-bar"><span>${escapeHTML(section.code.language || 'text')} · 教学示例</span><button data-action="copy-code" data-section="${i}">复制代码</button></div><pre><code>${escapeHTML(section.code.value)}</code></pre></div>`:''}</section>`).join('')}<section class="checklist" id="lesson-checks"><h2>检查你的学习结果</h2>${lesson.checks.map((check,i)=>`<label><input type="checkbox" data-check="${i}" ${checks[`${id}:${i}`]?'checked':''}><span>${escapeHTML(check)}</span></label>`).join('')}</section><div class="lesson-note"><h3>常见误区</h3><p>${escapeHTML(lesson.pitfall)}</p></div><div class="lesson-note"><h3>恢复与回退</h3><p>${escapeHTML(lesson.recovery)}</p></div><section class="lesson-section" id="lesson-sources"><h2>参考资料</h2><ul class="source-list">${lesson.sources.map(source=>`<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)} ↗</a></li>`).join('')}</ul><p class="small muted">外链为原始资料入口，第三方页面的商业内容不属于本站内容。</p></section><div class="lesson-complete"><button class="button ${done?'secondary':'primary'}" data-action="complete" aria-pressed="${done}">${icon(done?'check':'book')}${done?'已读本课 · 点击撤销':'标记本课已读'}</button><p>保存在本机浏览器，不代表已完成实操。</p></div><nav class="lesson-nav" aria-label="相邻课程">${index>0?`<a href="${courseURL(lessons[index-1].id)}"><small>上一课</small>${escapeHTML(lessons[index-1].title)}</a>`:'<a href="#/courses"><small>学习路径</small>返回全部课程</a>'}${index<lessons.length-1?`<a href="${courseURL(lessons[index+1].id)}"><small>下一课</small>${escapeHTML(lessons[index+1].title)}</a>`:'<a href="#/courses"><small>完成本轮阅读</small>回顾全部课程</a>'}</nav></article><aside class="page-toc" aria-label="本课目录"><h2>本课内容</h2>${lesson.sections.map((s,i)=>`<a href="${courseURL(id)}" data-action="section" data-target="section-${i}">${escapeHTML(s.title)}</a>`).join('')}<a href="${courseURL(id)}" data-action="section" data-target="lesson-checks">检查学习结果</a><a href="${courseURL(id)}" data-action="section" data-target="lesson-sources">参考资料</a></aside></div>`;
}
function clientsPage() {
  const clients = [
    { title:'Windows',icon:'windows',id:'5-2',description:'从订阅导入、系统代理到 TUN，先完成一条连接，再核对应用实际走向。',items:[['Clash Verge Rev','Mihomo','https://github.com/clash-verge-rev/clash-verge-rev'],['v2rayN','按所选内核','https://github.com/2dust/v2rayN']] },
    { title:'macOS',icon:'apple',id:'5-3',description:'核对系统网络权限与客户端支持范围。不要把 Windows 的操作入口直接套用。',items:[['Clash Verge Rev','Mihomo','https://github.com/clash-verge-rev/clash-verge-rev'],['Surge','独立配置格式','https://manual.nssurge.com/']] },
    { title:'Android',icon:'android',id:'5-4',description:'理解 VPN 授权、后台限制与分应用设置；每个客户端分别维护配置。',items:[['FlClash','Mihomo','https://github.com/chen08209/FlClash'],['v2rayNG','Xray 路线','https://github.com/2dust/v2rayNG'],['sing-box','独立 JSON 配置','https://sing-box.sagernet.org/clients/']] },
    { title:'iOS',icon:'phone',id:'5-5',description:'从配置导入和 VPN 授权开始。按实际设备核对策略、连接记录和后台行为。',items:[['Shadowrocket','独立配置格式','https://apps.apple.com/us/app/shadowrocket/id932747118'],['Surge','独立配置格式','https://manual.nssurge.com/'],['sing-box','独立 JSON 配置','https://sing-box.sagernet.org/clients/']] }
  ];
  return `<div class="container">${pageIntro('你的设备，有自己的操作路线。','共通知识集中学习，操作入口与配置语法分开维护。先选择平台，再跟随对应客户端章节。','客户端指南')}<div class="notice"><strong>素材状态：</strong>当前为官方资料整理，所有平台均未标记为本教程已实操复现。Windows、iOS 将优先补充设备截图；不以平台优先级替代验证状态。</div><div class="clients-grid">${clients.map(client=>`<article class="client-card"><div class="client-card-top">${icon(client.icon)}<h2>${client.title}</h2><span class="tag">资料整理</span></div><p>${client.description}</p><ul>${client.items.map(([name,core,url])=>`<li><span>${name}<br><small class="muted">${core}</small></span><a href="${url}" target="_blank" rel="noopener noreferrer">官方入口 ↗</a></li>`).join('')}</ul><a class="text-link" href="${courseURL(client.id)}">阅读 ${client.title} 操作路线 ${icon('arrow')}</a></article>`).join('')}</div></div>`;
}
function labsPage() { return `<div class="container">${pageIntro('动一下规则，看懂请求的去向。','在本地教学模型里切换链路、调整顺序。这里使用示例数据，不发送网络请求，也不修改设备代理设置。','交互实验')}<div class="lab-grid"><section class="lab-box"><h2>实验一：请求经过哪几跳？</h2><p>切换直连、单节点和链式路径，再点击节点查看职责。</p><div id="lab-network">${networkDiagram()}</div><a class="text-link" style="margin-top:24px" href="${courseURL('7-2')}">阅读前置与落地原理 ${icon('arrow')}</a></section><section class="lab-box"><h2>实验二：哪条规则先命中？</h2><p>修改域名，或用箭头调整规则顺序。第一条匹配的规则决定本次演示路径。</p><label class="field-label" for="domain-input">请求的域名</label><input class="lab-input" id="domain-input" value="video.example.com" spellcheck="false" autocomplete="off"><div id="rule-demo">${ruleDemo('video.example.com')}</div><p class="lab-help">试试 internal.example.com、example.com 或 other.test。再把 MATCH 移到最上方，观察它为什么会遮住后面的规则。</p><p class="lab-help">只演示 DOMAIN、DOMAIN-SUFFIX 与 MATCH 的顺序关系，不是完整的 Mihomo 规则引擎。支持的真实语法请查阅对应内核文档。</p><a class="text-link" href="${courseURL('8-4')}">学习规则顺序与兜底 ${icon('arrow')}</a></section></div><div class="notice"><strong>准备进入实操？</strong>先保存原配置，再根据自己的客户端核对参数。<a class="text-link" href="assets/mihomo-chain.example.yaml" download>下载 Mihomo 链式教学片段 ${icon('arrow')}</a><br>此文件含占位参数与前置策略组依赖，不能直接导入使用；不包含任何账号或订阅。</div></div>`; }
function ruleDemo(raw) {
  const domain = raw.trim().toLowerCase().replace(/\.$/,'');
  const valid = domain.length <= 253 && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(domain);
  const match = valid ? rules.findIndex(rule => rule.type==='MATCH' || (rule.type==='DOMAIN' && domain===rule.value) || (rule.type==='DOMAIN-SUFFIX' && (domain===rule.value || domain.endsWith('.'+rule.value)))) : -1;
  return `<ol class="rule-list">${rules.map((rule,i)=>`<li class="rule-row ${i===match?'matched':''}"><span class="muted">${i+1}</span><code>${rule.type},${rule.value?rule.value+',':''}${rule.target}</code><button class="icon-button" data-action="rule-up" data-rule="${i}" ${i===0?'disabled':''} aria-label="上移第 ${i+1} 条规则">↑</button><button class="icon-button" data-action="rule-down" data-rule="${i}" ${i===rules.length-1?'disabled':''} aria-label="下移第 ${i+1} 条规则">↓</button></li>`).join('')}</ol><div class="rule-result" aria-live="polite">${match>=0?`<b>命中第 ${match+1} 条 · ${rules[match].target}</b>${rules[match].explanation}`:'<b>请输入有效的域名</b>例如 video.example.com；不含 https://、端口或路径。'}</div>`;
}
function toolsPage() {
  const items = [ ['IPinfo','出口与 ASN','查看本次访问的来源 IP、地区和网络归属；单独查询某个地址不代表当前出口。','https://ipinfo.io/what-is-my-ip'],['BrowserLeaks IP','浏览器出口','补充核对本次浏览器连接的 IP 信息，并结合客户端连接记录解释。','https://browserleaks.com/ip'],['BrowserLeaks DNS','DNS 观察','观察测试所见的解析服务器信息。结果需结合解析设置与测试条件。','https://browserleaks.com/dns'],['BrowserLeaks WebRTC','WebRTC 观察','检查浏览器暴露的相关网络信息，不把单次结果扩大为所有应用的路径。','https://browserleaks.com/webrtc'],['IP.SB','IPv4 / IPv6 与归属','补充查询地址与归属资料。数据库标签供参考，页面可能包含商业推广。','https://ip.sb/'],['Test IPv6','双栈连通','检查 IPv4、IPv6 与相关连通性。检测目标本身不可达时，需单独判断。','https://test-ipv6.com/'] ];
  return `<div class="container">${pageIntro('每一种检测，回答一个具体问题。','先明确预期路径，再结合连接日志、出口信息和目标访问做交叉验证。工具链接均为直接入口，无推广参数。','IP 检测工具')}<div class="tool-grid">${items.map(([title,tag,desc,url])=>`<article class="tool-card"><span class="tag">${tag}</span><h2>${title}</h2><p>${desc}</p><a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">打开检测工具 ${icon('external')}</a></article>`).join('')}</div><div class="notice"><strong>站内不提供自动检测：</strong>这些链接在新标签页打开第三方工具。本站的无广告承诺不涵盖外站。IP 标签和数据库结果不等于所有应用都使用此出口，也不保证目标网站接受该 IP。</div><p style="padding-bottom:40px"><a class="text-link" href="${courseURL('9-6')}">学习如何保存可复查的检测记录 ${icon('arrow')}</a></p></div>`;
}
function troubleshootingPage() {
  const issues=[['配置导入失败，或提示解析错误','先确认下载的是客户端支持的配置格式，而不是网页或错误提示。记录错误行号，核对缩进、字段以及客户端和内核版本。恢复原配置后，只调整出错部分。','12-1'],['一直超时，或提示认证失败','核对服务器地址、端口、协议、账号及认证方式。分别检查入口与落地是否可达，不要同时修改 DNS、规则和节点。保存对应时间的日志。','12-2'],['延迟测试有结果，网页却打不开','延迟测试只对应测试目标和方法。重新发起目标请求，依次核对 DNS、代理连接、TLS、网站响应与实际应用行为。','12-3'],['设置了链式代理，出口却不对','确认规则选择的是最终落地出口，再检查该节点是否通过预期前置拨号。将本次请求的连接记录与检测页 IP 对照，避免只看客户端当前选中名称。','12-4'],['TUN 开启后异常，或更新后失效','检查服务权限、其他 VPN 冲突、系统路由与本次配置变化。先回到已知可用配置，再一次改变一个条件复测。','12-5'],['需要求助，但不知道提供什么','整理系统、客户端与内核版本、复现步骤、预期与实际路径、同一时间窗口的日志，以及已试过的恢复步骤。账号、订阅链接和密钥必须脱敏。','12-6']];
  return `<div class="container">${pageIntro('先找证据，再改配置。','从你观察到的现象开始，一次只验证一个假设。保留原配置和复现条件，让每一步都能回退。','故障排查')}<div class="troubleshoot-list">${issues.map(([title,desc,id])=>`<details><summary>${title}</summary><p>${desc}</p><a class="text-link" href="${courseURL(id)}">查看完整排查步骤 ${icon('arrow')}</a></details>`).join('')}</div></div>`;
}
function aboutPage() { return `<div class="container">${pageIntro('把知识说清楚，把依据留得住。','路由课是一份从零基础到进阶的代理配置学习手册。课程依据本项目 V2 大纲展开，持续补充可复查的操作材料。','内容与来源')}</div><article class="article-narrow"><h2>本站绝对无任何广告</h2><p>不设置广告位，不接受付费收录、软文、赞助推荐或付费排名，不使用返佣链接、分销码、推广码及隐性导流。正文、图解与下载示例遵循相同原则。</p><p>第三方官网可能有商业内容，本站仅提供与学习有关的直接入口，不承诺外站也无广告。</p><h2>这一版包含什么</h2><p>2026 年 10 月 25 日内容初版：按 V2 大纲的 12 个模块、72 个课题生成阅读内容，提供课程导航、全文搜索、本机阅读进度与两类教学演示。</p><p>课文由大纲扩写与官方资料整理。原大纲中称为“完整图文”的课题保留标题，但本版真实客户端步骤截图仍待补充。尚未完成逐客户端复现，也没有新增用户个人服务使用评价；案例章节用于说明记录与验证方法。</p><h2>如何理解内容状态</h2><ul><li><strong>资料整理：</strong>依据公开或官方文档编写，不能替代本机实操验证。</li><li><strong>用户确认用过：</strong>需要真实经历、使用时间与条件，当前未新增这类记录。</li><li><strong>本教程已实操复现：</strong>需要对应版本、操作截图、连接证据与验证范围，当前课程尚未使用这一标记。</li></ul><h2>本机学习记录</h2><p>“已读”标记、检查清单与上次阅读位置保存在当前浏览器，不上传到服务器。更换设备、浏览器或清除站点数据后，记录不会自动同步。已读状态不表示网络配置通过测试。</p><h2>资料与配置示例</h2><p>每篇课程在文末列出资料来源。不同客户端的配置结构分别说明；下载的 Mihomo 链式片段使用占位参数，需要合并到已有配置并逐项核验。</p><a class="button secondary" href="assets/mihomo-chain.example.yaml" download>下载教学配置片段 ${icon('arrow')}</a></article>`; }
function render() {
  const [route='', value] = location.hash.replace(/^#\/?/,'').split('/');
  activeLesson = null;
  document.body.classList.toggle('reading-mode', route==='course');
  document.title = '路由课 · 从连接到理解';
  const pages = { courses:()=>catalog(value || 'all'), course:()=>lessonPage(value || '1-1'), clients:clientsPage, labs:labsPage, tools:toolsPage, troubleshooting:troubleshootingPage, about:aboutPage };
  $('#main').innerHTML = route ? (pages[route]?.() || `<div class="container empty-state"><h1>页面不存在</h1><p><a href="#/">返回首页</a></p></div>`) : home();
  header(route);
  footer();
  $('#search-dialog').close();
}
function updateNetwork() { ['hero-network','lab-network','lesson-network'].forEach(id=>{const element=document.getElementById(id);if(element)element.innerHTML=networkDiagram();}); }
function search(query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = words.length ? lessons.filter(lesson => {const text=[lesson.title,lesson.summary,lesson.module.title,...lesson.sections.flatMap(section=>[section.title,...(section.paragraphs||[]),...(section.steps||[]),section.code?.value || '']),...(lesson.checks||[]),lesson.pitfall,lesson.recovery].join(' ').toLowerCase(); return words.every(word=>text.includes(word));}) : lessons.filter(lesson=>['1-1','5-2','7-2','8-4','9-6','12-3'].includes(lesson.id));
  $('#search-count').textContent = words.length ? `找到 ${results.length} 节课程${results.length>20?'，显示前 20 条':''}` : '从这些常用课程开始';
  $('#search-results').innerHTML = results.length ? results.slice(0,20).map(lesson=>`<a class="search-result" href="${courseURL(lesson.id)}" data-action="search-result"><b>${lesson.id.replace('-','.')}　${escapeHTML(lesson.title)}</b><small>${escapeHTML(lesson.module.title)} · ${escapeHTML(lesson.summary)}</small></a>`).join('') : '<div class="empty-state">没有找到相关课程。试试“订阅”“DNS”或“链式”。</div>';
}
function openSearch() { $('#search-dialog').showModal();$('#search-input').value='';search('');$('#search-input').focus(); }
document.addEventListener('click', async event => {
  if (event.target.closest('#nav-links a, #course-sidebar a')) {
    $('#nav-links')?.classList.remove('open');
    $('#course-sidebar')?.classList.remove('open');
    document.querySelectorAll('[data-action="mobile-nav"], [data-action="course-menu"]').forEach(toggle => toggle.setAttribute('aria-expanded','false'));
  }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  switch(button.dataset.action) {
    case 'search':openSearch();break;
    case 'close-search':$('#search-dialog').close();break;
    case 'search-result':$('#search-dialog').close();break;
    case 'mobile-nav':{const open=$('#nav-links').classList.toggle('open');button.setAttribute('aria-expanded',open);button.setAttribute('aria-label',open?'关闭导航':'打开导航');break;}
    case 'filter':location.hash=`#/courses/${button.dataset.filter}`;break;
    case 'network-mode':networkMode=button.dataset.mode;selectedNode=null;updateNetwork();document.querySelector(`[data-mode="${networkMode}"]`)?.focus();break;
    case 'node':selectedNode=button.dataset.node;updateNetwork();document.querySelector(`[data-node="${selectedNode}"]`)?.focus();break;
    case 'feature':feature=button.dataset.feature;document.querySelectorAll('.feature-tab').forEach(tab=>tab.setAttribute('aria-selected',tab.dataset.feature===feature));$('#feature-panel').innerHTML=featurePanel();break;
    case 'course-menu':{const open=$('#course-sidebar').classList.toggle('open');button.setAttribute('aria-expanded',open);break;}
    case 'section':event.preventDefault();document.getElementById(button.dataset.target)?.scrollIntoView({block:'start'});break;
    case 'complete':{
      const id=activeLesson.id;completed=completed.includes(id)?completed.filter(value=>value!==id):[...completed,id];const saved=persist('route-classroom-completed-v1',completed);const scroll=window.scrollY;render();window.scrollTo(0,scroll);$('[data-action="complete"]').focus({preventScroll:true});if(saved)toast(completed.includes(id)?'已标记本课已读，进度已保存。':'已撤销本课的已读标记。');break;
    }
    case 'copy-code':{
      const code=activeLesson.sections[Number(button.dataset.section)].code.value;
      try{if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(code);toast('代码已复制。请替换占位参数并按课程核验。');}catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(button.closest('.code-box').querySelector('code'));selection.removeAllRanges();selection.addRange(range);toast('已选中代码，请按 Ctrl+C 或长按复制。');}break;
    }
    case 'rule-up':case 'rule-down':{
      const from=Number(button.dataset.rule);const to=from+(button.dataset.action==='rule-up'?-1:1);if(to<0 || to>=rules.length)return;[rules[from],rules[to]]=[rules[to],rules[from]];$('#rule-demo').innerHTML=ruleDemo($('#domain-input').value);const nextButton=document.querySelector(`[data-rule="${to}"][data-action="${button.dataset.action}"]`);if(nextButton&&!nextButton.disabled)nextButton.focus();else $('#domain-input').focus();break;
    }
  }
});
document.addEventListener('input', event=>{if(event.target.id==='search-input')search(event.target.value);if(event.target.id==='domain-input')$('#rule-demo').innerHTML=ruleDemo(event.target.value);});
document.addEventListener('change',event=>{if(event.target.matches('[data-check]')&&activeLesson){checks[`${activeLesson.id}:${event.target.dataset.check}`]=event.target.checked;persist('route-classroom-checks-v1',checks);}});
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(!$('#search-dialog').open)openSearch();else $('#search-dialog').close();}
  if(event.target.matches('g[data-action="node"]')&&(event.key==='Enter'||event.key===' ')){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
  if(event.target.getAttribute('role')==='tab'&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const tabs=[...event.target.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];const target=tabs[(tabs.indexOf(event.target)+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];target.click();if(target.isConnected)target.focus();}
  if(event.key==='Escape'){ if($('#search-dialog').open)$('#search-dialog').close();$('#nav-links')?.classList.remove('open');$('#course-sidebar')?.classList.remove('open');document.querySelectorAll('[aria-expanded="true"]').forEach(el=>el.setAttribute('aria-expanded','false')); }
});
$('#search-dialog').addEventListener('click',event=>{if(event.target===$('#search-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();$('#main').focus();});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});});
render();
