import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { CrmApiResultType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ColumnsState } from 'qnzs-ui/es/pro-table/types';
import React, { useRef, useState } from 'react';
import { SchemaGridFormType } from '.';

interface useSchemaConfigProps {
  code: string;
  schemas: SchemaGridFormType[];
  ready?: boolean;
}

const getDefaultColumns = (schemas: SchemaGridFormType[]) => {
  const data: Record<string, ColumnsState> = {};
  schemas.forEach((schema, order) => {
    data[schema.name] = {
      title: schema.label,
      show: schema.disabledInSetting
        ? true
        : schema.defaultShowInSetting || false,
      order,
      disabled: schema.disabledInSetting,
    };
  });
  return data;
};

const useSeachConfig = ({
  code,
  ready = true,
  ...rest
}: useSchemaConfigProps) => {
  const context = React.useContext(ConfigContext);
  const configIdRef = useRef<string | undefined>(undefined);
  const [schemas, setSchemas] = useState<SchemaGridFormType[]>([]);

  const {
    loading,
    data = getDefaultColumns(rest.schemas),
    refresh,
  } = useRequest(
    () =>
      context
        .request<CrmApiResultType<{ id: string; config: string }>>(
          '/statistics/headerFields/query',
          {
            params: { lists: code },
          },
        )
        .then((res) => {
          configIdRef.current = res?.result?.id;
          if (res.result?.config) {
            try {
              const data = JSON.parse(res.result.config);
              updateSchemas(data);
              return data;
            } catch (error) {}
          }
          const initData = getDefaultColumns(rest.schemas);
          updateSchemas(initData);
          return initData;
        })
        .catch(() => {
          const initData = getDefaultColumns(rest.schemas);
          updateSchemas(initData);
        }),
    {
      ready,
      cacheKey: code,
    },
  );

  const updateSchemas = (configData: Record<string, ColumnsState>) => {
    const newSchemas: SchemaGridFormType[] = [];
    rest.schemas.forEach((schema) => {
      if (configData[schema.name]?.show !== false) {
        newSchemas.push({
          ...schema,
          order: configData[schema.name]?.order,
        });
      }
    });
    setSchemas(newSchemas);
  };

  const update = (columns: Record<string, ColumnsState>) => {
    context
      .request<CrmApiResultType<{}>>('/statistics/headerFields/edit', {
        method: 'PUT',
        data: {
          id: configIdRef.current,
          lists: code,
          config: JSON.stringify(columns),
        },
      })
      .then((res) => {
        if (res.code === 0) {
          message.success('设置成功');
        }
      })
      .finally(refresh);
  };

  const reset = () => {
    update(getDefaultColumns(rest.schemas));
  };

  return {
    loading,
    columns: data,
    schemas,
    refresh,
    update,
    reset,
    updateSchemas,
  };
};

export default useSeachConfig;
