import { DefaultTemplateFullStyle } from '@aicc/designer/es/constants';
import DemoConfigRender from './Configure';
import DemoElementRender from './Element';

const DemoMaterial = {
  id: '',
  title: 'Demo',
  icon: <div>D</div>,
  component: 'demo',
  'component-props': {
    title: 'demo',
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: false,
    },
  },
};

export { DemoConfigRender, DemoElementRender, DemoMaterial };
