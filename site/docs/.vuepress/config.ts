import { defineUserConfig } from 'vuepress';
import { viteBundler } from '@vuepress/bundler-vite';
import theme from './theme.js';
const siteBase = process.env.SITE_BASE || '/';
export default defineUserConfig({
  base: siteBase, lang: 'zh-CN', title: '路由课',
  description: '无广告的代理配置课程，从首次连接到链式代理、分流规则与故障排查。',
  dest: 'dist', bundler: viteBundler(), theme,
  plugins: [{
    name: 'proxy-guide-base-links',
    extendsMarkdown(md) {
      const renderLink = md.renderer.rules.link_open;
      md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
        const href = tokens[index].attrGet('href');
        if (siteBase !== '/' && href?.startsWith('/') && !href.startsWith('//') && !href.startsWith(siteBase)) {
          tokens[index].attrSet('href', siteBase + href.slice(1));
        }
        return renderLink ? renderLink(tokens, index, options, env, renderer) : renderer.renderToken(tokens, index, options);
      };
    },
  }],
  head: [
    ['script', {}, 'try { if (!localStorage.getItem("vuepress-theme-hope-scheme")) localStorage.setItem("vuepress-theme-hope-scheme", "dark"); } catch {}'],
    ['link', { rel: 'icon', href: siteBase + 'logo.svg' }], ['meta', { name: 'theme-color', content: '#10243f' }]
  ],
});
