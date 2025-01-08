import {
  ConfigContext,
  ConfigProviderProps,
} from '@aicc/context/es/ConfigProvider';
import { ASRDataType, CrmApiResultType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { Options } from 'ahooks/lib/useRequest/src/types';
import React from 'react';

const useASRDataType = <T = ASRDataType>(
  options?: Options<T[], any>,
  formatResult?: (data?: ASRDataType[]) => T[] | undefined,
  applyProduct?:string
) => {
  const context = React.useContext<ConfigProviderProps>(ConfigContext);
  return useRequest(
    () =>
      context
        .request<CrmApiResultType<string | undefined>>('/asrTts/getConfig2', {
          method: 'POST',
          data: { type: 1,applyProduct },
        })
        .then(
          (res) =>
            (formatResult?.(JSON.parse(res?.result || '[]')) as T[]) || [],
        ),
    {
      ...(options || {}),
    },
  );
};

export default useASRDataType;
