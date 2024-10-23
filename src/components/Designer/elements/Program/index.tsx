import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import { ApplyElementType } from '../../components/Element/Base/interface';
import { CustomerElementTypes } from '../../interface';
import ProgramConfigRender from './Configure';
import ProgramElementRender from './Element';

const ProgramMaterial: ApplyElementType = {
  id: '',
  title: '学习地图',
  icon: 'text',
  component: CustomerElementTypes.PROGRAM_APPLY,
  'component-props': {
    type: 'image',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '公司客服之星成长计划',
        deadline: '2022-11-14',
        status: 0,
      },
      {
        title: '公司业务精英成长路径',
        status: 1,
        progress: 80,
      },
      {
        title: '新员工成长计划',
        deadline: '2023-11-14',
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
      title: '学习地图',
      moreColumn: 'map',
    },
  },
};

export { ProgramConfigRender, ProgramElementRender, ProgramMaterial };
