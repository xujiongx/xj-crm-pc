import { CarouselMaterial } from '@/components/Decoration/elements/Carousel';
import { ImageMaterial } from '@/components/Decoration/elements/Image';
import { NavigationMaterial } from '@/components/Decoration/elements/Navigation';
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
