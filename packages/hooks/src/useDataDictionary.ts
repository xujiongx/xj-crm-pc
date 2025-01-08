import {
  ConfigContext,
  ConfigProviderProps,
} from '@aicc/context/es/ConfigProvider';
import { CrmApiResultType, DataDictionaryItemType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { Options } from 'ahooks/lib/useRequest/src/types';
import React from 'react';

const useDataDictionary = <T = DataDictionaryItemType>(
  code: string,
  options?: Options<T[], any>,
  formatResult?: (data?: DataDictionaryItemType[]) => T[] | undefined,
) => {
  const context = React.useContext<ConfigProviderProps>(ConfigContext);
  return useRequest(
    () =>
      context
        .request<CrmApiResultType<Array<DataDictionaryItemType>>>(
          '/sys/dict/queryDictItem',
          {
            params: { dictCode: code },
          },
        )
        .then(
          (res) => (formatResult?.(res?.result) as T[]) || res?.result || [],
        ),
    {
      cacheKey: code,
      ...(options || {}),
    },
  );
};

export default useDataDictionary;
