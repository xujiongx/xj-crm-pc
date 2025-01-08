import dayjs from 'dayjs';
import type { SchemaWorkOrderItem } from './interface';

/** 后台数据解析成表格格式 */
export const parseValue = (
  schemas: SchemaWorkOrderItem[],
  values?: Record<string, string>,
) => {
  const { orderFile, ...rest } = values || {};
  const result: Record<string, any> = { ...rest };
  try {
    for (const item of schemas) {
      const { fieldTypeD, fieldId, fieldValue } = item;
      if (!fieldValue) continue;
      switch (fieldTypeD) {
        case 5:
        case 6:
        case 8:
          result[fieldId!] = JSON.parse(fieldValue || '[]');
          break;
        /** 日期 */
        case 9:
          result[fieldId!] = dayjs(fieldValue, 'YYYY-MM-DD');
          break;
        /** 时间 hh:mm:ss */
        case 10:
          result[fieldId!] = dayjs(fieldValue, 'HH:mm:ss');
          break;
        /** 日期+时间 */
        case 11:
          result[fieldId!] = dayjs(fieldValue, 'YYYY-MM-DD HH:mm:ss');
          break;
        default:
          result[fieldId!] = fieldValue!;
          break;
      }
    }

    const files = JSON.parse(orderFile || '[]');
    if (files?.length) {
      result['orderFile'] = files;
    }
  } catch (error) {
    console.log(error, '解析工单数据错误');
  }

  return {
    schemas,
    values: result,
  };
};

/** 表单格式解析成后台数据格式 */
export const formatValue = (
  schemas: SchemaWorkOrderItem[],
  values: Record<string, any>,
) => {
  const { orderFile, ...rest } = values;
  const result: Record<string, string> = { ...rest };
  for (const item of schemas) {
    const { fieldTypeD, fieldId } = item;
    const fieldValue = values[fieldId!];
    switch (fieldTypeD) {
      case 5:
      case 6:
      case 8:
        result[fieldId!] = fieldValue ? JSON.stringify(fieldValue || []) : '';
        break;
      /** 日期 */
      case 9:
        result[fieldId!] = dayjs(fieldValue).format('YYYY-MM-DD');
        break;
      /** 时间 hh:mm:ss */
      case 10:
        result[fieldId!] = dayjs(fieldValue).format('HH:mm:ss');
        break;
      /** 日期+时间 */
      case 11:
        result[fieldId!] = dayjs(fieldValue).format('YYYY-MM-DD HH:mm:ss');
        break;
      default:
        result[fieldId!] = fieldValue!;
        break;
    }
  }

  /** 处理上传文件 */
  if (orderFile?.length) {
    const files = orderFile?.reduce((result, item) => {
      if (item.originFileObj) {
        if (item.response?.code === 0) {
          result.push({
            uid: item.uid,
            name: item.name,
            type: item.type,
            size: item.size,
            url: item.response?.msg,
          });
        }
      } else {
        result.push(item);
      }
      return result;
    }, []);
    result['orderFile'] = JSON.stringify(files);
  }

  return result;
};
