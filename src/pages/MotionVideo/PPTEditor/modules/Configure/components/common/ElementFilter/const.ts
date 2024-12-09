import { ImageElementFilterKeys, ImageElementFilters } from "@/pages/MotionVideo/PPTEditor/types/slides"

export interface FilterOption {
  label: string;
  key: ImageElementFilterKeys;
  default: number;
  value: number;
  unit: string;
  max: number;
  step: number;
}

export const defaultFilters: FilterOption[] = [
  {
    label: '模糊',
    key: 'blur',
    default: 0,
    value: 0,
    unit: 'px',
    max: 10,
    step: 1,
  },
  {
    label: '亮度',
    key: 'brightness',
    default: 100,
    value: 100,
    unit: '%',
    max: 200,
    step: 5,
  },
  {
    label: '对比度',
    key: 'contrast',
    default: 100,
    value: 100,
    unit: '%',
    max: 200,
    step: 5,
  },
  {
    label: '灰度',
    key: 'grayscale',
    default: 0,
    value: 0,
    unit: '%',
    max: 100,
    step: 5,
  },
  {
    label: '饱和度',
    key: 'saturate',
    default: 100,
    value: 100,
    unit: '%',
    max: 200,
    step: 5,
  },
  {
    label: '色相',
    key: 'hue-rotate',
    default: 0,
    value: 0,
    unit: 'deg',
    max: 360,
    step: 10,
  },
  {
    label: '褐色',
    key: 'sepia',
    default: 0,
    value: 0,
    unit: '%',
    max: 100,
    step: 5,
  },
  {
    label: '反转',
    key: 'invert',
    default: 0,
    value: 0,
    unit: '%',
    max: 100,
    step: 5,
  },
  {
    label: '不透明度',
    key: 'opacity',
    default: 100,
    value: 100,
    unit: '%',
    max: 100,
    step: 5,
  },
];

export const presetFilters: {
  label: string;
  values: ImageElementFilters;
}[] = [
  { label: '黑白', values: { grayscale: '100%' } },
  {
    label: '复古',
    values: { sepia: '50%', contrast: '110%', brightness: '90%' },
  },
  { label: '锐化', values: { contrast: '150%' } },
  { label: '柔和', values: { brightness: '110%', contrast: '90%' } },
  { label: '暖色', values: { sepia: '30%', saturate: '135%' } },
  { label: '明亮', values: { brightness: '110%', contrast: '110%' } },
  { label: '鲜艳', values: { saturate: '200%' } },
  { label: '模糊', values: { blur: '2px' } },
  { label: '反转', values: { invert: '100%' } },
];
