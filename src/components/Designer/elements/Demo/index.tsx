import { DefaultTemplateFullStyle } from '../../constants';

export const DemoConfig = {
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
