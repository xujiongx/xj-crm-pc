import config from '@aicc/config';
import { parse } from 'qs';

/**
 * 获取 Url 参数
 * @param name 参数名称
 * @returns
 */
export function getQueryVariable(name: string) {
  const query = location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === name) {
      return pair[1];
    }
  }
  return false;
}

/** 是否https */
export function isHttps() {
  return location.protocol?.includes('https');
}

/** 是否为信任链接 */
export function isTrustUrl(url?: string) {
  if (!url) return false;
  return url.includes(config.crmPrefix) || url.includes(config.resourcePrefix);
}

export function urlParams(url: string) {
  const data = url.split('?');
  const newUrl = data[0];
  const index = newUrl.indexOf(config.crmPrefix);
  return {
    url: newUrl,
    params: parse(data[1]),
    path:
      index === -1 ? newUrl : newUrl.substring(index + config.crmPrefix.length),
  };
}
