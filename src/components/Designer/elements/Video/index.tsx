import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import VideoConfigRender from './Configure';
import VideoElementRender from './Element';

const VideoMaterial = {
  id: '',
  title: '互动视频',
  icon: 'video',
  component: 'video_apply',
  'component-props': {
    type: 'list',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '新产品快速演示培训',
        deadline: '2022-09-08',
        new: true,
      },
      {
        title: '公司发展历程与企业价值观培训',
        deadline: '2022-09-08',
        status: 1,
      },
      {
        title: '优秀销售成单秘籍',
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
      title: '互动视频',
      moreColumn: 'video',
    },
  },
};

export { VideoConfigRender, VideoElementRender, VideoMaterial };
