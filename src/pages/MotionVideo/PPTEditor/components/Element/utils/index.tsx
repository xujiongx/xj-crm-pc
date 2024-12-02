import { PPTElementShadow } from '../../../interface';

export const computeShadowStyle = (value?: PPTElementShadow) => {
  if (!value) return '';
  const { h, v, blur, color } = value;
  return `${h}px ${v}px ${blur}px ${color}`;
};
