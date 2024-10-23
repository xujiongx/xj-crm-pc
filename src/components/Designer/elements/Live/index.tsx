import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import LiveConfigRender from './Configure';
import LiveElementRender from './Element';

const LiveMaterial = {
  id: '',
  title: '直播',
  icon: 'live',
  component: 'live_apply',
  'component-props': {
    type: 'list',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '智能培训产品新版本更新内容及操作培训',
        deadline: '2024-09-08',
        status: 0,
      },
      {
        title: '工作手机产品介绍',
        deadline: '2022-09-08',
        status: 1,
      },
      {
        title: '高效能人士精进培训',
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
      title: '直播',
      moreColumn: 'live',
    },
  },
};

export { LiveConfigRender, LiveElementRender, LiveMaterial };
