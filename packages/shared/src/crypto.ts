import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { mode } from 'crypto-js/core';
import Pkcs7 from 'crypto-js/pad-pkcs7';

const key = Utf8.parse('JEECGBOOT1423670');

const options = {
  iv: key,
  mode: mode.CBC,
  padding: Pkcs7,
};

/** AES 加密 */
export const aesEncrypt = (text: string) => {
  return AES.encrypt(text, key, options).toString();
};

/** AES 解密 */
export const aesDecrypt = (text: string) => {
  return AES.decrypt(text, key, options).toString(Utf8);
};
