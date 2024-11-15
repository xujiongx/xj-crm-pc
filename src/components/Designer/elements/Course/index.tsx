import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import { ApplyElementType } from '../../components/Element/Base/interface';
import { CustomerElementTypes } from '../../interface';
import CourseConfigRender from './Configure';
import CourseElementRender from './Element';

const CourseMaterial: ApplyElementType = {
  id: '',
  title: '课程',
  icon: 'course',
  component: CustomerElementTypes.COURSE_APPLY,
  'component-props': {
    type: 'list',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '数字时代的交流：社交媒体客服',
        deadline: '2022-09-08',
        new: true,
      },
      {
        title: '服务至上：提升客户满意度',
        deadline: '2022-09-08',
        status: 1,
      },
      {
        title: '新晋基层管理者36计',
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
      title: '课程',
      moreColumn: 'course',
    },
  },
};

export { CourseConfigRender, CourseElementRender, CourseMaterial };
