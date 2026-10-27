# 路由课 · CodexGuide 界面复刻版

首页沿用 CodexGuide 的 Vue 组件、SCSS、工作台插图、滚动动效、卡片和案例切换结构，内容替换为代理教程。阅读页沿用 Hope 主题的侧栏、正文和页内目录，默认藏蓝色，支持切换浅蓝阅读模式。旧版仍在相邻 `web` 目录。

## 直接查看

已包含生产构建 `dist`。在当前目录执行 `node server.mjs`，然后打开 **http://127.0.0.1:4174**。Windows 可双击 `启动预览.cmd`。终端需保持运行，用 Ctrl+C 停止。

常用页面：

- 首页：`/`
- 快速上手：`/start/`
- 全部课程：`/courses/`
- 链式代理课程：`/lessons/7-2.html`
- 交互实验：`/labs/`
- 学习进度：`/progress/`

生产页面使用真实路径路由，请通过 HTTP 服务访问。直接双击 `dist/index.html` 不适用于 VuePress。

## 编辑与构建

已在 Windows、Node 24.22.1、pnpm 11.25.0 验证。Node 版本范围为 >=22 且 <25，锁定依赖见 pnpm-lock.yaml。

```powershell
pnpm install --frozen-lockfile
pnpm dev
# 开发预览：http://127.0.0.1:5174

pnpm build
pnpm start
# 生产预览：http://127.0.0.1:4174
```

`pnpm build` 包含搜索 Worker 的独立打包修正。请使用完整命令，不要只运行 `vuepress build docs`，否则保留版本的搜索 Worker 可能含不能在 classic Worker 中执行的模块导入。

## 内容与交互

- 12 模块、72 课迁自旧版 `web/content`，没有另写一套概念性占位文。
- 课程在 `docs/lessons`，栏目与模块索引在其他 `docs` 子目录。
- 首页：`docs/.vuepress/components/CodexHome.vue`、`HeroWorkbench.vue`。
- 原站视觉：`styles/home.scss`、`creative-scenes.scss`、`workbench-motion.scss`。
- 阅读页：`styles/interior.scss` 与 `styles/proxy.scss`，藏蓝/浅蓝仅作用于阅读面。
- 路径/规则实验：`ProxyLab.vue`。切换直连、单节点、链式路径，点选节点看职责；输入域名观察精确、后缀和兜底规则，并切换 MATCH 的顺序。
- 检查清单、已读与进度汇总使用浏览器 localStorage。不同域名、端口和浏览器分别存储，不会从旧版地址自动同步。
- 搜索沿用原站 slimsearch 界面，支持正文索引、Ctrl+K / Command+K 和 Escape。

## 无广告与内容边界

原站的付费社区区域沿用布局，改为开放课程与实验入口。没有接入原站支付、商户服务、访问统计或会员数据，也不伪造访问量。

课程正文保留原有资料状态说明：尚未完成逐客户端实操复现，真实操作截图待补充。实验只演示逻辑，不建立代理连接、修改本机设置或检测真实出口。第三方资料站的商业内容不属于本项目。

## 部署

发布目录为 `dist`。目录 URL（如 `/start/`）对应 `start/index.html`，文章对应 `/lessons/1-1.html`。GitHub Actions 会将完整构建产物发布到 Pages。

GitHub Pages 地址为 https://zhongwx58-sys.github.io/Agency-websites/ 。仓库源码位于 `site/`，每次推送 `main` 会自动构建、发布，地址保持不变。部署状态可在仓库 Actions 中查看。

GitHub Actions 使用 `SITE_BASE=/Agency-websites/`；图片、正文链接、导航与搜索已按子路径适配。仓库保留原有旧版文件；新版流程会等待旧的分支发布结束后再发布，避免旧页面覆盖新页面。

## 来源与许可

界面基础来自 https://github.com/freestylefly/CodexGuide ，固定提交 `498b52110c03fe4e395f1ba7564ff4c18e0b07e2`。保留原作 MIT 许可证 `LICENSE` 与署名。首页文本、品牌、链接与课程内容已按本项目替换，完整像素相等并非本次验收结论。

实际验证结果见 `验收记录.md`。源码和预构建页面均可继续编辑、重新构建。
