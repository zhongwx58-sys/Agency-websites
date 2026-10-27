# 路由课 · 代理配置教程

从首次连接到链式代理、分流规则与故障排查。12 个模块、72 课，开放阅读，无广告。

网站地址：**https://zhongwx58-sys.github.io/Agency-websites/**

## 更新网站

新版源代码在 **`site/`**。编辑 `site/docs/` 中的课程，或 `site/docs/.vuepress/` 中的界面组件与样式，然后提交并推送到 `main`。

每次推送会自动运行 `.github/workflows/deploy-pages.yml`，安装锁定依赖、构建完整站点并发布到 GitHub Pages。发布成功后网址保持不变。推送触发自动更新，构建与部署需要时间，并非本地保存后立即同步。

可在仓库的 **Actions → Deploy tutorial to GitHub Pages** 查看进度，也可手动运行 workflow。

## 本地开发

```sh
cd site
pnpm install --frozen-lockfile
pnpm dev
```

本地预览使用根路径；GitHub Actions 通过 `SITE_BASE=/Agency-websites/` 构建仓库子路径版本。

课程与功能说明见 `site/README.md`。界面基于 CodexGuide（MIT），原作许可证保留在 `site/LICENSE`；仓库原有许可证与旧版文件保留。
