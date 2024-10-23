import { Context } from 'umi-request';
import { signature, signatureUnToken } from './signature';
import { uid } from './uid';
import { urlParams } from './url';

/**
 * 获取token
 * @returns 存储的token值，如果不存在则返回undefined
 */
export function getToken() {
  return localStorage.getItem('token') || '';
}

/**
 * 请求签名中间件
 * 为请求添加签名认证相关的参数和头部信息
 * @param ctx - Umi请求的上下文环境
 */
export const signatureMiddleware = (ctx: Context, skipTokenSign = false) => {
  const urlData = urlParams(ctx.req.url); // 解析请求URL中的参数
  const allParams = { ...ctx.req.options.params, ...urlData.params };
  ctx.req.url = urlData.url; // 更新请求的URL
  let headers, params;
  let data = ctx.req.options.data;
  // 对请求参数进行签名
  if (ctx.req.options.skipTokenSign || skipTokenSign) {
    const uuid = uid();
    headers = { 'S-Access-Token': uuid };
    params = signatureUnToken(allParams, urlData.path, uuid);
    if (data) {
      data = signatureUnToken(data, urlData.path, uuid);
    }
  } else {
    const token = getToken();
    headers = { 'X-Access-Token': token };
    params = signature(allParams, urlData.path, token);
    if (ctx.req.options.data) {
      data = signature(ctx.req.options.data, urlData.path, token);
    }
  }
  ctx.req.options.headers = headers;
  ctx.req.options.params = params;
  ctx.req.options.data = data;
};

/**
 * 设置token
 * @param token - 要设置的token值，如果为空则删除token
 */
export function setToken(token?: string) {
  localStorage.setItem('token', token || '');
}

/**
 * 删除token
 */
export function removeToken() {
  localStorage.removeItem('token');
}
