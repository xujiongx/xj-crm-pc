import { CarouselConfig } from '../elements/Carousel/index';
import { DemoConfig } from '../elements/Demo';
import { ImageConfig } from '../elements/Image/index';
import { NavigationConfig } from '../elements/Navigation/index';

const MaterialBase = [
  CarouselConfig,
  NavigationConfig,
  ImageConfig,
  DemoConfig,
];

export const Materials = [
  {
    title: '基础组件',
    items: MaterialBase,
  },
  {
    title: '应用组件',
    items: [],
  },
];
