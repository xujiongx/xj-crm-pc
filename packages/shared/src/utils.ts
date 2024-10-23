export const isDev = () => process.env.NODE_ENV === 'development';

export const isNil = (val: any) => val === null || val === undefined;

/** 过滤SSML标签 */
export const filterSSML = (text?: string) => text?.replace(/<[^>]+>/g, '');

/** 生成区间 */
export function generateRange(arr: number[]) {
  if (arr.length === 1) {
    const [item] = arr;
    return [[item, item]];
  }
  const indexs = [...arr].sort((a, b) => a - b);
  const res: Array<typeof range> = [];
  let range: Array<number> = [];
  for (let i = 0; i < indexs.length; i++) {
    if (indexs[i + 1] - indexs[i] === 1) {
      range.push(indexs[i]);
    } else {
      const [start] = range?.length ? range : [indexs[i]];
      res.push([start, indexs[i]]);
      range = [];
    }
  }
  return res;
}

/** 根据下标高亮字符串 */
export function highlightKeyword({
  highlightIndex,
  str,
  style,
}: {
  highlightIndex: number[];
  str: string;
  style?: string;
}) {
  let res = '';
  const rangs = generateRange(highlightIndex || []);
  let index = 0;
  let i = 0;
  while (i < str.length) {
    const [start, end] = rangs[index] || [];
    if (start === i) {
      index += 1;
      i = end + 1;
      const temp = str.slice(start, i);
      res += `<span style="${style}">${temp}</span>`;
    } else {
      res += `${str[i]}`;
      i += 1;
    }
  }
  return res;
}

/** 将文件转成附件 */
export function transferMessage(file: {
  name: string;
  size?: number;
  type: string;
  response: any;
}) {
  const { name, type, response } = file;
  if (type?.includes('image')) {
    return `<img src="${response?.msg}" style="max-width: 259px; max-height: 251px" />`;
  }
  const kb = Number((file.size || 0) / 1024);
  const size =
    kb > 1024 ? `${Number(kb / 1024).toFixed(1)}MB` : `${kb.toFixed()}KB`;
  return `<a appendix="true" href="${response?.msg}" file-name="${name}" size="${size}" file-suffix="${type}" target="_blank" contenteditable="false" download />`;
}

/** 微信图文消息 */
export function renderWeChatMessage(data: Record<string, string>) {
  const html = `
    <div style="display: flex; gap: 5px; flex-direction: column;">
      <div>【图文标题】：${data.title}</div>
      <div>【消息描述】: ${data?.description}</div>
      <div>【跳转链接】: <a href="${data?.url}" target="__blank">${data?.url}</a> </div>
      <div>
        【图片预览】:
        <img
          style="max-width: 100px; max-height: 100px;"
          src="${data?.picurl}"
        />
      </div>
    </div>
  `;
  return html;
}

export function isFormData(values: any) {
  return values instanceof FormData;
}

export const geHoursTime = (time: number) => {
  const timeSecond = Math.floor(time);
  const minute = Math.floor(timeSecond / 60);
  const minutes = minute % 60 < 10 ? `0${minute % 60}` : minute % 60;
  const hour = Math.floor(timeSecond / 3600);
  const hours = `${hour < 10 ? `0${hour}` : hour}:`;
  const second = timeSecond % 60;
  return `${hours}${minutes}:${second < 10 ? `0${second}` : second}`;
};

export function randomInt(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function backoff(step: number, min: number, max: number) {
  if (step > 31) {
    step = 31;
  }
  const interval = randomInt(0, Math.min(max, min * Math.pow(2, step)));
  return Math.min(max, min + interval);
}

/** 替换字段中的中文符号为英文符号 */
export function replaceZHCharacter(str: string) {
  const character = {
    '，': ',',
    '！': '!',
    '？': '?',
    '：': ':',
    '、': ',',
    '；': ';',
    '“': '"',
    '”': '"',
    '（': '(',
    '）': ')',
    '【': '[',
    '】': ']',
    '。': '.',
  };
  return str.replace(
    new RegExp(`[${Object.keys(character).join('')}]`, 'g'),
    (match) => character[match],
  );
}

/**
 * 数字添加千分位
 * @param number
 * @returns
 */
export function thousandSeparator(number: string | number) {
  if (!number) return number;
  const parts = `${number}`?.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const VOICE_LANGUAGE_TYPE = [
  {
    label: '普通话',
    value: '1',
    disabled: false,
  },
  {
    label: '粤语',
    value: '2',
    disabled: false,
  },
  {
    label: '英语',
    value: '3',
    disabled: false,
  },
];

// 判断是否json字符串
export const getJsonString = (str: string) => {
  let isJson = true;
  try {
    JSON.parse(str);
  } catch (error) {
    isJson = false;
  }
  return isJson ? JSON.parse(str) : str;
};

/** 颜色16进制转10进制 */
export const hexToDecimal = (hexColor: string) => {
  // 去除可能存在的 "#" 符号
  if (hexColor.charAt(0) === '#') {
    hexColor = hexColor.substring(1);
  }

  // 返回十进制颜色值
  return parseInt(hexColor, 16);
};

// export const decimalToHex = (decimalColor: number) => {
//   return `#${decimalColor.toString(16)}`
// }
/** 颜色10进制转16进制 */
export const decimalToHex = (decimalColor: number) => {
  const r = (decimalColor >> 16) & 0xff;
  const g = (decimalColor >> 8) & 0xff;
  const b = decimalColor & 0xff;

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
