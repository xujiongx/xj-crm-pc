import { DefaultTemplateFullStyle, DefaultTitleConfig } from '../../constants';
import { ImageElementType } from '../../interface';

export const ImageConfig: ImageElementType = {
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
