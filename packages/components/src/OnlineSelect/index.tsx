import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { CrmApiListResultType, CrmApiResultType } from '@aicc/types';
import { useControllableValue, useRequest } from 'ahooks';
import { Select } from 'antd';
import { SelectProps, SelectValue } from 'antd/es/select';
import React from 'react';

type ServiceSourceType = 'label' | 'role';

const defaultParams: Record<string, unknown> = { pageSize: 99999 };

const ServiceOptions: Record<
  ServiceSourceType,
  {
    url: string;
    fieldNames?: { label?: string; value?: string };
    params?: Record<string, unknown>;
  }
> = {
  label: {
    url: '/SysLabel/SysLabel/queryUserList',
  },
  role: {
    url: '/sys/role/list',
    fieldNames: {
      label: 'roleName',
    },
  },
};

interface OnlineSelectProps extends SelectProps {
  source: ServiceSourceType;
}

const OnlineSelect: React.FC<OnlineSelectProps> = ({ source, ...props }) => {
  const { request } = React.useContext(ConfigContext);
  const [value] = useControllableValue<SelectValue>(props);

  const option = ServiceOptions[source];

  const { loading, data } = useRequest(
    () =>
      request<CrmApiResultType<CrmApiListResultType<any>>>?.(option.url, {
        params: option.params || defaultParams,
      }).then((res) => {
        return (
          res.result?.records?.map((item) => ({
            label: item[option.fieldNames?.label || 'name'],
            value: item[option.fieldNames?.value || 'id'],
            option: item,
          })) || []
        );
      }),
    {
      cacheKey: `online:select:${source}`,
    },
  );

  if (props.mode === 'multiple' && !('maxTagCount' in props)) {
    props.maxTagCount = 'responsive';
  }

  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="label"
      options={data}
      loading={loading}
      value={loading ? undefined : value}
      placeholder="请选择"
      {...props}
    />
  );
};

export default OnlineSelect;
