import { modules } from '../course-data.js';
export default {
  '/': [
    { text:'快速上手', link:'/start/', collapsible:true, children:[{text:'快速上手',link:'/start/'}, ...modules[0].lessons.map(l => ({text:l.title,link:'/lessons/'+l.id+'.html'}))] },
    ...modules.slice(1).map(m => ({ text:m.title, link:'/courses/module-'+String(m.id).padStart(2,'0')+'/', collapsible:true, children:m.lessons.map(l=>({text:l.title,link:'/lessons/'+l.id+'.html'})) })),
    {text:'交互实验',link:'/labs/'}, {text:'检测工具',link:'/tools/'}, {text:'内容与来源',link:'/about/'}
  ]
};
