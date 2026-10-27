import { hopeTheme } from 'vuepress-theme-hope';
import navbar from './navbar.js';
import sidebar from './sidebar/index.js';
export default hopeTheme({
  logo:'/logo.svg', author:{name:'路由课'}, repo:'https://github.com/zhongwx58-sys/Agency-websites', navbar, sidebar,
  darkmode:'toggle', print:false, pure:true, focus:false, breadcrumb:true, displayFooter:true,
  footer:'路由课 · 无广告的代理配置学习手册 · 界面基于 CodexGuide（MIT）',
  copyright:'课程内容：路由课 · 界面原作 © 2026 canghe',
  pageInfo:['Author','Date','Word','ReadingTime'], blog:false,
  markdown:{align:true,attrs:true,codeTabs:true,component:true,gfm:true,mark:true,tasklist:true,tabs:true},
  plugins:{icon:false, copyCode:true, slimsearch:{indexContent:true, hotKeys:[{key:'k',ctrl:true},{key:'k',meta:true}]}}
});
