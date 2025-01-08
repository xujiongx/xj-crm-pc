import { pathToRegexp } from '@qixian.cs/path-to-regexp';
import { Route } from 'qnzs-ui/es/basic-layout/typings';
import { autoFixContext } from 'react-activation';
import jsxDevRuntime from 'react/jsx-dev-runtime';
import jsxRuntime from 'react/jsx-runtime';
import { isDev } from './utils';

export type RouteNode = {
  path: string;
  name: string;
  icon?: string;
  hideInMenu?: boolean;
  access?: string;
  routes?: RouteNode[];
};

/** 默认跳转第一个菜单页 */
export function getDefaultRoute(routes: Route[]): string {
  const filter = (menus: Route[]): string => {
    if (menus.length) {
      if (menus[0].routes) {
        return filter(menus[0].routes.filter((route) => !route.hideInMenu));
      } else {
        return menus[0].path || '/';
      }
    }
    return '/';
  };

  return filter(
    routes
      .find((route) => route.path === '/')
      ?.routes?.filter(
        (route) => route.path && route.path !== '/' && !route.hideInMenu,
      ) || [],
  );
}

export const isAccess = (
  access: string | string[],
  accessData: Record<string, boolean>,
) => {
  if (typeof access === 'string') {
    return accessData[access];
  } else {
    let hasAccess = false;
    access.forEach((item) => {
      if (accessData[item]) hasAccess = true;
    });
    return hasAccess;
  }
};

/** 修改路由 */
export function microPatchRoutes(
  routes: Route[],
  access: Record<string, boolean>,
  master?: boolean,
) {
  const loop = (data: Array<Route> = []) =>
    data.forEach((item, index) => {
      /** 子模块独立开发时，不限制路由权限 */
      if (master || isMicroApp() || !isDev()) {
        if (item?.access && !isAccess(item.access, access)) {
          data[index].unAccessible = true;
        }
      }

      if (item?.routes) loop(item.routes);
    });
  loop(routes);
}

/**
 * 获取匹配到的路由
 * @param path 当前路由
 * @param routes 路由数据
 * @returns
 */
export function getMatchRoute(path: string, routes: Route[]) {
  let route: Route | undefined = undefined;
  const loop = (routes: Route[]) => {
    const item = routes.find((item) => {
      const key = item.path || '/';
      const pathname =
        path.substring((window as any).routerBase.length - 1, path.length) ||
        '/';
      if (item.routes?.length) {
        return loop(item.routes);
      }
      // 处理微模块
      if (item.microAppName) {
        return pathname.indexOf(item.path!) === 0;
      }
      return pathToRegexp(key).test(pathname);
    });
    item && (route = item);
  };
  loop(routes);
  return route;
}

export const fixKeepAliveContext = () => {
  autoFixContext(
    [jsxRuntime, 'jsx', 'jsxs', 'jsxDEV'],
    [jsxDevRuntime, 'jsx', 'jsxs', 'jsxDEV'],
  );
};

export const isMicroApp = () => {
  return !!(window as any).__POWERED_BY_QIANKUN__;
};
