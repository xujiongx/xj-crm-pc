import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import MomentConfigRender from './Configure';
import MomentElementRender from './Element';

const MomentMaterial = {
  id: '',
  title: '精彩瞬间',
  icon: 'moment',
  component: 'moment_apply',
  'component-props': {
    type: 'list',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '公司企业文化--培训精彩瞬间',
        pv: 5000,
      },
      {
        title: '消防大练兵精彩瞬间',
        pv: 5000,
      },
      {
        title: '2024年中秋节日营销培训精彩回顾',
        pv: 5000,
      },
    ],
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: true,
      ...DefaultTitleConfig['component-props'],
      title: '精彩瞬间',
      moreColumn: 'moment',
    },
  },
};

export { MomentConfigRender, MomentElementRender, MomentMaterial };
