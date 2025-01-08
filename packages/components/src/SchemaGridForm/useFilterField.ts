import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { CrmApiResultType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { SelectValue } from 'antd/es/select';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import React from 'react';
import { OUTPUT_TYPE } from './utils';

interface feildType {
  type: number;
  name: string;
  status: number;
  esId: string;
  fieldType: number;
  order: number;
  id: number;
  fields: feildType[];
}

/** 呼叫类型 */
export const CallType = [
  {
    value: 1,
    label: '呼入',
  },
  {
    value: 2,
    label: '呼出',
  },
];

const useFilterField = (isSap = false) => {
  const context = React.useContext(ConfigContext);

  const { data: feildList = [] } = useRequest(
    () =>
      context
        .request<CrmApiResultType<feildType[]>>('/sap/fields/settings/data')
        .then((res) => res.result || []),
    {
      cacheKey: 'field:setting',
      ready: isSap, //后端接口不是全局的 只有质检才有权限 后续可以叫后端优化
    },
  );

  const formatCulumn = (values: feildType, record, text: string) => {
    const { fieldType, type, esId } = values;
    if (type === 2) {
      const value = record?.customField?.[esId];
      return fieldType === 3 && value
        ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        : value;
    }
    return fieldType === 3 && text
      ? dayjs(text).format('YYYY-MM-DD HH:mm:ss')
      : text;
  };

  const filterColumn = (data) => {
    let result = [...data];
    feildList.forEach((field: feildType) => {
      const index = result.findIndex((item) => item.dataIndex === field.esId);
      if (field.status === 0 && index !== -1) {
        result.splice(index, 1);
      }
      /**字段渲染 */
      const column = {
        dataIndex: field.esId,
        title: field.name,
        render: (text, record) => formatCulumn(field, record, text),
      };

      if (field.status === 1) {
        if (field.type === 2) {
          // 如果type为2 自定义字段，则直接添加到result中
          result.push(column);
        } else if (field.type === 1) {
          if (index !== -1) {
            // 当status为1时（通用字段开启状态），替换result中的当前项
            result[index] = {
              ...result?.[index],
              dataIndex: field.esId,
              title: field.name,
            };
          } else {
            result.push(column);
          }
        }
      }
    });
    return result;
  };

  const filterSchema = (data) => {
    let result = cloneDeep(data);
    feildList.forEach((field: feildType) => {
      const type = OUTPUT_TYPE.find((l) => l.value === field.fieldType)?.type;
      let options: SelectValue[] = [];
      if (type === 'select') {
        options =
          field?.esId === 'callType'
            ? CallType
            : field?.fields?.map((item) => ({
                label: item?.name,
                value: item?.id,
              }));
      }
      if (field.type === 2 && field.status === 1) {
        result.push({
          name: field.esId,
          label: field.name,
          type,
          isField: 2,
          props: {
            options,
            showTime: true,
            mode: options.length ? 'multiple' : '',
          },
        });
      } else if (field.type === 1) {
        const index = result.findIndex((item) => item.name === field.esId);
        if (index !== -1 && field.status === 1) {
          result[index] = {
            name: field.esId,
            label: field.name,
            isField: 1,
            ...result?.[index],
            props: {
              options:
                field.name === 'callType'
                  ? result?.[index].props.options
                  : options,
              showTime: true,
            },
          };
        } else if (field.status === 1) {
          result.push({
            name: field.esId,
            label: field.name,
            type,
            isField: 1,
            props: {
              options,
              showTime: true,
              mode: options.length ? 'multiple' : '',
            },
          });
        } else if (index !== -1 && field.status === 0) {
          result.splice(index, 1);
        }
      }
    });
    return result;
  };

  //删除自定义字段列表已经删除的字段
  function cleanObject(obj: any, keysToKeep: any[]): any {
    const keys = Object.keys(obj);
    const filteredKeys = keys.filter((key) => {
      const item = obj[key];
      return (
        item.type !== 2 ||
        keysToKeep.some((keepItem) => keepItem.fieldId === item.key)
      );
    });
    const newObj: { [key: string]: any } = {};
    filteredKeys.forEach((key) => {
      newObj[key] = obj[key];
    });

    return newObj;
  }

  const filterField = (data) => {
    let result = cloneDeep(data);
    const keyList = Object.keys(data);
    let length = keyList.length || 99;
    feildList.map((item: feildType) => {
      const feild = {
        [item.esId]: {
          title: item.name,
          key: item.esId,
          show: false,
          ...result?.[item.esId],
          // order: length++,
        },
      };
      if (item.status === 0) {
        delete result[item.esId];
      }
      if (item?.type === 2 && item.status === 1) {
        const values = { ...result, ...feild };
        result = { ...result, ...feild };
      } else if (item?.type === 1 && item.status === 1) {
        result[item.esId] = {
          ...feild[item.esId],
          // disabled: ['callCode'].includes(item.esId),
          order: result?.[item.esId]?.order ?? length,
        };
      }
    });
    return cleanObject(result, feildList);
  };

  return {
    filterField,
    filterColumn,
    filterSchema,
    feildList,
  };
};

export default useFilterField;
