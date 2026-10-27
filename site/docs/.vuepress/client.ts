import { defineClientConfig, withBase } from 'vuepress/client';
import CodexHome from './components/CodexHome.vue';
import SectionIntro from './components/SectionIntro.vue';
import ProxyLab from './components/ProxyLab.vue';
import LessonProgress from './components/LessonProgress.vue';
import ProgressOverview from './components/ProgressOverview.vue';
import './styles/home.scss';
import './styles/creative-scenes.scss';
import './styles/workbench-motion.scss';
import './styles/interior.scss';
import './styles/proxy.scss';
export default defineClientConfig({enhance:({app})=>{
  app.component('CodexHome',CodexHome); app.component('SectionIntro',SectionIntro);
  app.component('ProxyLab',ProxyLab); app.component('LessonProgress',LessonProgress); app.component('ProgressOverview',ProgressOverview);
  if (typeof window !== 'undefined') {
    const sections: Record<string,string> = {'快速上手导航':'/start/','进阶教程导航':'/advanced/','实战案例导航':'/recipes/','客户端导航':'/clients/'};
    document.addEventListener('click',event=>{
      if(event.detail===0)return;
      const target=event.target as Element | null;
      if(target?.closest('.vp-dropdown'))return;
      const button=target?.closest<HTMLButtonElement>('.vp-dropdown-title');
      const link=button?sections[button.getAttribute('aria-label')||'']:null;
      if(link)window.location.assign(withBase(link));
    });
  }
}});
