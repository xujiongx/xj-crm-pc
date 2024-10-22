import { DefaultTemplateFullStyle } from '../../constants';
import { BaseElementType } from '../../interface';
import CarouselConfigRender from './Configure';
import CarouselElementRender from './Element';

interface CarouselElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    height?: string;
    images?: Array<{
      linkStyle?: 'column' | 'link';
      column?: string;
      link?: string;
      imgUrl?: string;
    }>;
  };
}

const CarouselMaterial: CarouselElementType = {
  id: '',
  title: '轮播图',
  component: 'carousel',
  'component-props': {
    height: '180px',
    images: [
      {
        imgUrl: '',
        linkStyle: 'column',
      },
      {
        imgUrl: '',
        linkStyle: 'column',
      },
      {
        imgUrl: '',
        linkStyle: 'column',
      },
    ],
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: false,
    },
  },
};

export {
  CarouselConfigRender,
  CarouselElementRender,
  CarouselElementType,
  CarouselMaterial,
};
