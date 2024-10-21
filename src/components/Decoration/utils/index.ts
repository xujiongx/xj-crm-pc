/** 生成唯一标识 */
export function uid(radix = 'xxxxxxxxxxxxxxxx') {
  return radix.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
