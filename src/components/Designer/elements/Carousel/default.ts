import { DefaultTemplateFullStyle } from '../../constants';
import { CarouselElementType } from '../../interface';

export const DefaultCarouselConfig: Partial<CarouselElementType> = {
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
