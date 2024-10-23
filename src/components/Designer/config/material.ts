import { CarouselMaterial } from '@aicc/designer/es/elements/Carousel';
import { ImageMaterial } from '@aicc/designer/es/elements/Image';
import { NavigationMaterial } from '@aicc/designer/es/elements/Navigation';
import { CourseMaterial } from '../elements/Course';
import { LiveMaterial } from '../elements/Live';
import { MomentMaterial } from '../elements/Moment';
import { PartnerMaterial } from '../elements/Partner';
import { ProgramMaterial } from '../elements/Program';
import { TextMaterial } from '../elements/Text';
import { VideoMaterial } from '../elements/Video';

const MaterialBase = [CarouselMaterial, NavigationMaterial, ImageMaterial];

const CustomerComponents = [
  CourseMaterial,
  TextMaterial,
  PartnerMaterial,
  VideoMaterial,
  ProgramMaterial,
  LiveMaterial,
  MomentMaterial,
];

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
