import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { CrmApiResultType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { Select, SelectProps, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import {
  ForwardRefRenderFunction as FC,
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
} from 'react';
import './index.less';

const prefix = 'aicc-model';

/** 大模型数据结构 */
export type ModelType = {
  id: string;
  name: string;
  logo: string;
  nameMapping: string;
  model: string;
  modelName: string;
  trainParam: string;
  maxInLength: string;
  maxOutLength: string;
  searchSwitch: 0 | 1;
};

export interface ModelSelectRefs {
  models: ModelType[];
}

interface ModelSelectProps extends SelectProps {
  modelList?: ModelType[];
  params?: Record<string, any>;
  onLoad?: (data: ModelType[]) => void;
}

const ModelSelect: FC<ModelSelectRefs, ModelSelectProps> = (
  { params = { productType: 'All' }, modelList, onLoad, ...props },
  ref,
) => {
  const { request } = useContext(ConfigContext);

  const { data = modelList, loading } = useRequest(
    async () => {
      const res = await request<CrmApiResultType<ModelType[]>>(
        '/llm/llmConfig/list',
        { params },
      );
      if (res?.code !== 0) return [];
      onLoad?.(res?.result || []);
      return res?.result;
    },
    {
      cacheKey: `queryLlmConfig`,
      ready: !modelList,
    },
  );

  const options = useMemo(
    () =>
      data?.reduce<DefaultOptionType[]>((result, item) => {
        const { name, nameMapping, modelName } = item;
        const target = result?.find((item) => item?.key === name);
        if (!target) {
          result.push({
            label: nameMapping,
            key: name,
            options: [{ label: modelName, value: item?.modelName, ...item }],
          });
        } else {
          target?.options?.push({
            label: modelName,
            value: item?.modelName,
            ...item,
          });
        }
        return result;
      }, []),
    [data],
  );

  useImperativeHandle(ref, () => ({
    models: data || [],
  }));

  return (
    <Select
      options={options}
      loading={loading}
      popupClassName={prefix}
      placeholder="请选择模型"
      allowClear
      virtual={false}
      optionRender={(option) => {
        const { data, label } = option;
        return (
          <Space>
            {data.logo ? (
              <img className={`${prefix}-logo`} src={data.logo} />
            ) : null}
            <span>{label}</span>
            <span className={`${prefix}-tag`}>{data?.maxInLength}</span>
            {data?.trainParam ? (
              <span className={`${prefix}-tag`}>{data?.trainParam}</span>
            ) : null}
          </Space>
        );
      }}
      labelRender={({ value, label }) => {
        const tartget = data?.find(
          (item) => item?.[props?.fieldNames?.value || 'modelName'] === value,
        );
        if (!tartget) return label;
        return (
          <Space>
            {tartget.logo ? (
              <img className={`${prefix}-logo`} src={tartget.logo} />
            ) : null}
            <span>{label}</span>
          </Space>
        );
      }}
      showSearch
      optionFilterProp="label"
      {...props}
    />
  );
};

export default forwardRef(ModelSelect);
