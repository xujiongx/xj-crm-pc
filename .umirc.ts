import { defineConfig } from '@umijs/max';
import proxyConfig from './config/proxy.config';
import routeConfig from './config/route.config';
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
  routes: routeConfig,
  npmClient: 'pnpm',
  alias: {
    ...genAlias(),
  },
});
