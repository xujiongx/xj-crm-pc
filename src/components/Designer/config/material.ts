import { CarouselMaterial } from '@aicc/designer/es/elements/Carousel';
import { ImageMaterial } from '@aicc/designer/es/elements/Image';
import { NavigationMaterial } from '@aicc/designer/es/elements/Navigation';
import { CourseMaterial } from '../elements/Course';
import { DemoMaterial } from '../elements/Demo';

const MaterialBase = [CarouselMaterial, NavigationMaterial, ImageMaterial];

const CustomerComponents = [DemoMaterial, CourseMaterial];

export const Materials = [
  {
    title: '基础组件',
    items: MaterialBase,
  },
  {
    title: '应用组件',
    items: CustomerComponents,
  },
];
