import { BaseElementType, TitleConfig } from '../../interface';
import TitleConfigRender from './Configure';
import TitleElementRender from './Element';

interface TitleElementType extends BaseElementType {
  component: 'title';
  'component-props'?: TitleConfig;
}

const TitleMaterial: TitleElementType = {
  id: '',
  title: '图片',
  component: 'title',
  'component-props': {
    title: '标题',
    fontSize: '16px',
    fontWeight: true,
    color: '#121A26',
    iconColor: '#1A47E6',
    more: '更多',
    moreLinkStyle: 'column',
    showMoreIcon: false,
    align: 'left',
  },
};

export {
  TitleConfigRender,
  TitleElementRender,
  TitleElementType,
  TitleMaterial,
};
