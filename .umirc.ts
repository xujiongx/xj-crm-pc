import { defineConfig } from '@umijs/max';
import proxyConfig from './config/proxy.config';
const genAlias = require('./scripts/utils/genAlias');

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: proxyConfig,
  mfsu: {
    strategy: 'normal',
    shared: {
      react: {
        singleton: true,
      },
      'react-router': {
        singleton: true,
      },
      'react-router-dom': {
        singleton: true,
      },
    },
  },
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
  alias: {
    ...genAlias(),
  },
});
