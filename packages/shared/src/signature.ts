import config from '@aicc/config';
import md5 from 'crypto-js/md5';
import qs from 'qs';
import { getToken } from './request';
import { uid } from './uid';
import { urlParams } from './url';
import { isFormData } from './utils';

export function signature(
  values: Record<string, any> | FormData,
  path: string,
  token?: string,
) {
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

export function signatureUnToken(
  values: Record<string, any> | FormData,
  path: string,
  token?: string,
) {
  token = token || uid();
  const isForm = isFormData(values);
  let keys: string[] = [];
  if (isForm) {
    if (!values.has('timestamp'))
      values.append('timestamp', new Date().getTime().toString());
    values.set('S-Access-Token', token);
    values.set('X-Access-Path', path);
    keys = Array.from((values as any).keys());
  } else {
    if (!values['timestamp']) values['timestamp'] = new Date().getTime();
    values['S-Access-Token'] = token;
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
      values.delete('S-Access-Token');
      values.delete('X-Access-Path');
      values.append('sign', sign);
    } else {
      delete values['S-Access-Token'];
      delete values['X-Access-Path'];
      values.sign = sign;
    }
  }
  return values;
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

export const stringifySignature = (
  params: Record<string, any>,
  token: string,
) => qs.stringify(signature(params, token));

export const signatureRecord = (
  values: Record<string, any>,
  path: string,
  token?: string,
) => signature(values, path, token) as Record<string, any>;
