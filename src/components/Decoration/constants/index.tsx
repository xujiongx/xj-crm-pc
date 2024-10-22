import React from 'react';
import { TitleElementType } from '../elements/Title';

export const DefaultTemplateFullStyle: React.CSSProperties = {
  margin: '5px 0 5px 0',
  backgroundColor: '#fff',
  borderRadius: '0px',
  boxShadow: 'none',
};

export const DefaultTemplateCardStyle: React.CSSProperties = {
  margin: '5px 12px 5px 12px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0px 0px 6px 0px #f0f0f0',
};

export const DefaultTitleConfig: Partial<TitleElementType> = {
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
