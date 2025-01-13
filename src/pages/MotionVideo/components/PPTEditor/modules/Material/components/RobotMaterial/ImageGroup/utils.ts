import { decimalToHex, getJsonString } from '@aicc/shared';

const OUTER_CLOTH = ['JacketColor', 'yifuColor'];

export const getOuterClothColor = (imageConfigParam: string) => {
  if (imageConfigParam && getJsonString(imageConfigParam)) {
    const imageConfigParamJson = getJsonString(imageConfigParam) || {};
    const outerClothKey = Object.keys(imageConfigParamJson).find((item) =>
      OUTER_CLOTH.includes(item),
    );
    if (outerClothKey) {
      return decimalToHex(imageConfigParamJson[outerClothKey]?.colorValue);
    }
  }
};
