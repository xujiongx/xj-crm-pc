import { DefaultTemplateFullStyle, DefaultTitleConfig } from '../../constants';
import { NavigationElementType } from '../../interface';

export const NavigationConfig: NavigationElementType = {
  id: '',
  title: '图文导航',
  component: 'navigation',
  'component-props': {
    count: 4,
    sections: [
      {
        title: '导航',
        linkStyle: 'column',
        color: '#1D2129',
      },
      {
        title: '导航',
        linkStyle: 'column',
        color: '#1D2129',
      },
      {
        title: '导航',
        linkStyle: 'column',
        color: '#1D2129',
      },
      {
        title: '导航',
        linkStyle: 'column',
        color: '#1D2129',
      },
    ],
  },
  'decorator-props': {
    template: 'full',
    style: DefaultTemplateFullStyle,
    title: {
      visible: false,
      ...DefaultTitleConfig['component-props'],
      title: '标题',
    },
  },
};
