import config from '@aicc/config';
import React from 'react';
import { extend, RequestMethod } from 'umi-request';

export interface GuidanceItemType {
  id?: string;
  /** 页面名称 */
  pageName?: string;
  /** 路径 */
  path?: string;
  /** 附件 */
  file?: string;
  /** 附件地址 */
  fileUrl?: string;
  /** 显示文案 */
  text?: string;
}

const request: RequestMethod = extend({
  prefix: config.crmPrefix,
});

export const ConfigContext = React.createContext<ConfigProviderProps>({
  request: request,
  guidanceData: {},
});

export interface ConfigProviderProps {
  request: RequestMethod;
  guidanceData?: Record<string, GuidanceItemType>;
  children?: React.ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({
  guidanceData,
  request,
  children,
}) => {
  return (
    <ConfigContext.Provider value={{ guidanceData, request }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
