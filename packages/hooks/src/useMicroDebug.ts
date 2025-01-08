import {
  ConfigContext,
  ConfigProviderProps,
} from '@aicc/context/es/ConfigProvider';
import { isDev, isMicroApp } from '@aicc/shared';
import { useRequest } from 'ahooks';
import {
  BasicLayoutProps,
  CrmApiResultType,
  UserInfoType,
  UserPermissionMenuItem,
} from 'packages/types';
import React from 'react';

const useMicroDebug = (value: BasicLayoutProps): BasicLayoutProps => {
  const context = React.useContext<ConfigProviderProps>(ConfigContext);
  const manual = !(isDev() && !isMicroApp());

  const acessRes = useRequest(
    () =>
      context
        .request<
          CrmApiResultType<{
            auth: {
              action: string;
              describe: string;
              type: '0' | '1' | '2';
            }[];
            menu: UserPermissionMenuItem[];
          }>
        >('/sys/permission/getUserPermissionByToken')
        .then((res) => {
          const access: Record<string, boolean> = {};
          const { auth = [] } = res.result || {};
          auth.forEach((item) => {
            if (item.type === '0') access[item.action] = true;
          });
          return access;
        }),
    {
      manual,
    },
  );

  const userInfoRes = useRequest(
    () =>
      context
        .request<
          | CrmApiResultType<UserInfoType & { enterpriseCode: string }>
          | undefined
        >('/sys/info')
        .then((res) => res?.result),
    {
      manual,
    },
  );

  return {
    ...value,
    access: value.access || acessRes.data || {},
    userInfo: value.userInfo || userInfoRes.data || {},
  };
};

export default useMicroDebug;
