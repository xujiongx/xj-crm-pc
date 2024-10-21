import { DefaultCarouselConfig } from './Carousel/default';
import { DefaultImageConfig } from './Image/default';
import { DefaultNavigationConfig } from './Navigation/default';

export const MaterialBase = [
  {
    title: '轮播图',
    component: 'carousel',
    ...DefaultCarouselConfig,
  },
  {
    title: '图文导航',
    component: 'navigation',
    ...DefaultNavigationConfig,
  },
  {
    title: '图片',
    component: 'image',
    ...DefaultImageConfig,
  },
];

// export const MaterialMarketing = [
//   {
//     title: '课程',
//     icon: 'course',
//     component: 'course_apply',
//     ...DefaultCourseApplyConfig,
//   },
//   {
//     title: '文本考试',
//     icon: 'text',
//     component: 'text_apply',
//     ...DefaultTextApplyConfig,
//   },
//   {
//     title: '人机对练',
//     icon: 'partner',
//     component: 'partner_apply',
//     ...DefaultPartnerApplyConfig,
//   },
//   {
//     title: '互动视频',
//     icon: 'video',
//     component: 'video_apply',
//     ...DefaultVideoApplyConfig,
//   },
//   {
//     title: '学习地图',
//     icon: 'text',
//     component: 'program_apply',
//     ...DefaultProgramApplyConfig,
//   },
//   {
//     title: '直播',
//     icon: 'live',
//     component: 'live_apply',
//     ...DefaultLiveApplyConfig,
//   },
//   {
//     title: '精彩瞬间',
//     icon: 'moment',
//     component: 'moment_apply',
//     ...DefaultMomentApplyConfig,
//   },
// ];

export const Materials = [
  {
    title: '基础组件',
    items: MaterialBase,
  },
  // {
  //   title: '应用组件',
  //   items: MaterialMarketing,
  // },
];

// const ElementTypeMap: Record<string, any> = {
//   [ElementTypes.IMAGE]: ImageElement,
//   [ElementTypes.CAROUSEL]: CarouselElement,
//   [ElementTypes.NAVIGATION]: NavigationElement,
// };
