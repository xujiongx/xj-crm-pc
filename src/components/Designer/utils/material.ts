import { DefaultCarouselConfig } from '../elements/Carousel/default';
import { DefaultImageConfig } from '../elements/Image/default';
import { DefaultNavigationConfig } from '../elements/Navigation/default';

const MaterialBase = [
  {
    title: '轮播图',
    component: 'carousel',
    ...DefaultCarouselConfig,
  },
  {
    title: '图文导航',
    component: 'navigation',
    ...DefaultNavigationConfig,
  },
  {
    title: '图片',
    component: 'image',
    ...DefaultImageConfig,
  },
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
