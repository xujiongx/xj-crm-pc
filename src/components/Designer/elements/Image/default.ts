import { DefaultTemplateFullStyle, DefaultTitleConfig } from '../../constants';
import { ImageElementType } from '../../interface';

export const DefaultImageConfig: Partial<ImageElementType> = {
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
