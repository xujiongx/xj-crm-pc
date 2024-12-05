import config from '@/config';
import md5 from 'crypto-js/md5';
import qs, { parse } from 'qs';
import queryString from 'query-string';

export function getToken() {
  return localStorage.getItem('token') || '';
}

export function isFormData(values: any) {
  return values instanceof FormData;
}

export function signature(
  values: Record<string, any> | FormData,
  path: string,
  token?: string,
) {
  // eslint-disable-next-line no-param-reassign
  token = token || getToken();
  const isForm = isFormData(values);
  let keys: string[] = [];
  if (isForm) {
    if (!values.has('timestamp'))
      values.append('timestamp', new Date().getTime().toString());
    values.set('X-Access-Token', token);
    values.set('X-Access-Path', path);
    keys = Array.from((values as any).keys());
  } else {
    if (!values['timestamp']) values['timestamp'] = new Date().getTime();
    values['X-Access-Token'] = token;
    values['X-Access-Path'] = path;
    keys = Object.keys(values);
  }
  let valuesString = '';
  keys.sort().forEach((key) => {
    let value;
    if (isForm) {
      value = values.get(key);
      if (typeof value === 'string') {
        value = value.trim();
        values.set(key, value);
      }
    } else {
      value = values[key];
      if (typeof value === 'string') {
        value = value.trim();
        values[key] = value;
      }
    }
    if (
      key !== 'sign' &&
      ((typeof value === 'string' && value !== '') ||
        typeof value === 'number' ||
        typeof value === 'boolean')
    ) {
      valuesString += `${valuesString === '' ? '' : '&'}${key}=${value}`;
    }
  });
  if (valuesString) {
    const sign = md5(valuesString).toString().toUpperCase();
    if (isForm) {
      values.delete('X-Access-Token');
      values.delete('X-Access-Path');
      values.append('sign', sign);
    } else {
      delete values['X-Access-Token'];
      delete values['X-Access-Path'];
      values.sign = sign;
    }
  }
  return values;
}

export const stringifySignature = (
  params: Record<string, any>,
  token: string,
) => qs.stringify(signature(params, token));

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
export const stringifySignatureWithUrl = (
  url: string,
  params?: Record<string, any>,
  token?: string,
) => {
  const data = urlParams(url);
  return `${config.crmPrefix}${data.path}?${qs.stringify(
    signature({ ...data.params, ...params }, data.path, token),
  )}`;
};

export const getUrlParams = <T>() => {
  const { query } = queryString.parseUrl(location.href);
  return query as unknown as T;
};