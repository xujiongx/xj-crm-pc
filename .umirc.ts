import { defineConfig } from '@umijs/max';
import proxyConfig from './config/proxy.config';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: proxyConfig,
  layout: {
    title: '@umijs/max',
  },
  routes: [
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
  ],
  npmClient: 'pnpm',
});
