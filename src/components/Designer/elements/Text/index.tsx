import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import TextConfigRender from './Configure';
import TextElementRender from './Element';

const TextMaterial = {
  id: '',
  title: '文本考试',
  icon: 'text',
  component: 'text_apply',
  'component-props': {
    type: 'title',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '公司客服能力认证考试',
        deadline: '2024-09-08',
        status: 0,
      },
      {
        title: '公司产品与服务综合考试',
        status: 1,
      },
      {
        title: '消防专题培训考试',
        deadline: '2022-09-08',
        status: 2,
      },
    ],
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: true,
      ...DefaultTitleConfig['component-props'],
      title: '文本考试',
      moreColumn: 'text',
    },
  },
};

export { TextConfigRender, TextElementRender, TextMaterial };
