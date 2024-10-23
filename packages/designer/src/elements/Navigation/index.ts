import { DefaultTemplateFullStyle, DefaultTitleConfig } from '../../constants';
import { BaseElementType } from '../../interface';
import NavigationConfigRender from './Configure';
import NavigationElementRender from './Element';

interface NavigationElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    count?: number;
    sections?: Array<{
      linkStyle?: 'column' | 'link';
      column?: string;
      link?: string;
      imgUrl?: string;
      title?: string;
      color?: string;
    }>;
  };
}

const NavigationMaterial: NavigationElementType = {
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

export {
  NavigationConfigRender,
  NavigationElementRender,
  NavigationElementType,
  NavigationMaterial,
};
