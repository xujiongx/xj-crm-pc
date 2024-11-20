export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  {
    name: 'CRUD 示例',
    path: '/table',
    component: './Table',
  },
  {
    name: '页面设计器',
    path: '/design',
    component: './Design',
  },
  {
    name: 'Dnd',
    path: '/dnd',
    component: './Dnd',
  },
  {
    name: 'Utils',
    path: '/utils',
    component: './Utils',
  },
  {
    name: 'Flow',
    path: '/flow',
    component: './Flow',
  },
  {
    name: '图片设计器',
    path: '/image-designer',
    component: './IDesigner',
  },
];
