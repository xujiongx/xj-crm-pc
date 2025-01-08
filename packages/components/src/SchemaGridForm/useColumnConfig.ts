import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { CrmApiResultType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ColumnsState, ProColumnProps } from 'qnzs-ui/es/pro-table/types';
import React, { useRef } from 'react';

interface useSchemaConfigProps {
  code: string;
  columns: Array<ProColumnProps<any>>;
  queryApi?: string;
  editApi?: string;
}

export const getDefaultColumns = (columns: Array<ProColumnProps<any>>) => {
  const data: Record<string, ColumnsState> = {};
  columns.forEach((column, index) => {
    if (column.dataIndex !== 'action' && typeof column.dataIndex === 'string') {
      data[column.dataIndex] = {
        show: column.disabledInSetting
          ? true
          : column.defaultShowInSetting || false,
        order: index,
        title: column?.title as string,
        disable: column.disabledInSetting,
      };
    }
  });
  return data;
};

const useColumnConfig = ({ code, columns }: useSchemaConfigProps) => {
  const context = React.useContext(ConfigContext);
  const configIdRef = useRef<string | undefined>(undefined);

  const {
    loading,
    data = getDefaultColumns(columns),
    refresh,
  } = useRequest(() =>
    context
      .request<CrmApiResultType<{ id: string; config: string }>>(
        '/statistics/headerFields/query',
        {
          params: { lists: code },
        },
      )
      .then((res) => {
        configIdRef.current = res?.result?.id;
        if (res?.result?.config) {
          try {
            return JSON.parse(res.result.config) || {};
          } catch (error) {}
        }
        return getDefaultColumns(columns);
      }),
  );

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

  const reset = (data?: Record<string, ColumnsState>) => {
    update(data || getDefaultColumns(columns));
  };

  return {
    loading,
    columns: data,
    refresh,
    update,
    reset,
  };
};

export default useColumnConfig;
