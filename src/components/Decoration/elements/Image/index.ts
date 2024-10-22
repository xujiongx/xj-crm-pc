import { DefaultTemplateFullStyle, DefaultTitleConfig } from '../../constants';
import { BaseElementType } from '../../interface';
import ImageConfigRender from './Configure';
import ImageElementRender from './Element';

interface ImageElementType extends BaseElementType {
  component: string;
  'component-props': {
    images?: Array<{
      linkStyle?: 'column' | 'link';
      column?: string;
      link?: string;
      imgUrl?: string;
    }>;
  };
}

const ImageMaterial: ImageElementType = {
  id: '',
  title: '图片',
  component: 'image',
  'component-props': {
    images: [
      {
        linkStyle: 'column',
      },
    ],
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: false,
      ...DefaultTitleConfig['component-props'],
      title: '标题',
    },
  },
};

export {
  ImageConfigRender,
  ImageElementRender,
  ImageElementType,
  ImageMaterial,
};
