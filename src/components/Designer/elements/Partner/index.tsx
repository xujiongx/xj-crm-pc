import {
  DefaultTemplateFullStyle,
  DefaultTitleConfig,
} from '@aicc/designer/es/constants';
import { ApplyElementType } from '../../components/Element/Base/interface';
import { CustomerElementTypes } from '../../interface';
import PartnerConfigRender from './Configure';
import PartnerElementRender from './Element';

const PartnerMaterial: ApplyElementType = {
  id: '',
  title: '人机对练',
  icon: 'partner',
  component: CustomerElementTypes.PARTNER_APPLY,
  'component-props': {
    type: 'list',
    showInfo: true,
    showCount: 4,
    hideInEmpty: true,
    data: [
      {
        title: '危机应对话术演练',
        deadline: '2022-09-08',
        new: true,
      },
      {
        title: '套餐升级销售话术工坊',
        deadline: '2022-09-08',
        status: 0,
      },
      {
        title: '投诉场景标准应答话术演练',
        status: 1,
      },
    ],
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: true,
      ...DefaultTitleConfig['component-props'],
      title: '人机对练',
      moreColumn: 'partner',
    },
  },
};

export { PartnerConfigRender, PartnerElementRender, PartnerMaterial };
