import qs from 'qs';
import { getToken } from './request';
import { signature } from './signature';
import { urlParams } from './url';

/**
 * 下载二进制为 xlsx
 * @param blobFile 二进制数据
 * @param fileName 文件名称
 * @returns
 */
export function downloadBlobToXlsx(blobFile?: Blob, fileName?: string) {
  downloadBlobToFile(
    blobFile,
    `${fileName || '文件'}.xlsx`,
    'application/xlsx',
  );
}

/**
 * 下载二进制为 word
 * @param blobFile 二进制数据
 * @param fileName 文件名称
 * @returns
 */
export function downloadBlobToWord(blobFile?: Blob, fileName?: string) {
  downloadBlobToFile(
    blobFile,
    `${fileName || '文件'}.doc`,
    'application/msword',
  );
}

/**
 * 下载签名文件
 * @param url 文件地址
 * @param fileName 文件名称
 */
export function downloadUrlFile(url: string, fileName = '') {
  const ele = document.createElement('a');
  ele.download = fileName;
  ele.style.display = 'none';
  const data = urlParams(url);
  ele.href = `${data.url}?${qs.stringify({ ...signature(data.params, data.path), 'X-Access-Token': getToken() })}`;
  document.body.appendChild(ele);
  // 触发点击
  ele.click();
  // 然后移除
  document.body.removeChild(ele);
}

/**
 * 下载免签文件
 * @param url 文件地址
 * @param fileName 文件名称
 */
export function downloadNoSignUrlFile(url: string, fileName = '') {
  const ele = document.createElement('a');
  ele.download = fileName;
  ele.style.display = 'none';
  ele.href = url;
  console.log(ele.href);
  document.body.appendChild(ele);
  // 触发点击
  ele.click();
  // 然后移除
  document.body.removeChild(ele);
}

/** 获取文件格式后缀 */
export function getFileFormat(path: string) {
  return path.substring(path.lastIndexOf('.') + 1).toLocaleLowerCase();
}

/**统一处理下载相对路径文件 规避预览 */
export function downloadBlobToFile(
  blobFile?: Blob,
  fileName?: string,
  type?: string,
) {
  if (!blobFile) return;
  const blob = new Blob([blobFile], { type });
  // @ts-ignore
  const url = window.URL || window.webkitURL || window.moxURL;
  const downloadUrl = url.createObjectURL(blob);
  const ele = document.createElement('a');
  ele.download = fileName || '';
  ele.style.display = 'none';
  ele.href = downloadUrl;
  document.body.appendChild(ele);
  ele.click();
  document.body.removeChild(ele);
  URL.revokeObjectURL(downloadUrl);
}

export function validFileFormat(name: string, format: string[]) {
  let last_dot_index = name.lastIndexOf('.');
  if (last_dot_index === -1) return false;
  let file_length = name.length;
  let suffix = name.substring(last_dot_index + 1, file_length).toLowerCase();
  if (format.findIndex((a) => a.toLowerCase() === suffix) === -1) {
    return false;
  }
  return true;
}
