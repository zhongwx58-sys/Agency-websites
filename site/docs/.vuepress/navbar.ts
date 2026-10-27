import { navbar } from 'vuepress-theme-hope';
import { modules } from './course-data.js';
const items = (ids: number[]) => modules.filter(m => ids.includes(m.id)).map(m => ({ text: m.title, link: '/courses/module-' + String(m.id).padStart(2, '0') + '/' }));
export default navbar([
  { text: '首页', link: '/' }, { text: '学习路线', link: '/guide/' },
  { text: '快速上手', link: '/start/', ariaLabel: '快速上手导航', children: items([1,2,3,4,5]) },
  { text: '进阶教程', link: '/advanced/', ariaLabel: '进阶教程导航', children: items([6,7,8,9,10]) },
  { text: '实战案例', link: '/recipes/', ariaLabel: '实战案例导航', children: items([11,12]) },
  { text: '客户端', ariaLabel: '客户端导航', children: [{text:'平台与客户端指南',link:'/clients/'}, ...items([5,6])] },
  { text: '交互实验', link: '/labs/', ariaLabel: '交互实验' },
  { text: '更多', ariaLabel:'更多导航', children: [{text:'全部课程',link:'/courses/'},{text:'检测工具',link:'/tools/'},{text:'故障排查',link:'/troubleshooting/'},{text:'学习进度',link:'/progress/'},{text:'内容与来源',link:'/about/'}] },
]);
