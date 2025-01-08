import dayjs from 'dayjs';
import { SchemaGridFormType } from '.';

interface customFieldItem {
  fieldName: string;
  queryType: number;
  queryCondition: string;
}

export const transformValues = (
  values: Record<string, any>,
  schemas: Array<SchemaGridFormType>,
) => {
  const newValues: Record<string, any> = {};
  let customField: Array<customFieldItem> = [];
  Object.keys(values).forEach((key) => {
    const value = values[key];
    const schema = schemas.find((schema) => schema.name === key);
    if (schema && schema.fieldNames) {
      if (
        value &&
        schema.fieldNames.length === 2 &&
        schema.type === 'date-range'
      ) {
        newValues[schema.fieldNames[0]] = dayjs.isDayjs(value[0])
          ? value[0].format(
              schema.props?.showTime
                ? 'YYYY-MM-DD HH:mm:ss'
                : 'YYYY-MM-DD 00:00:00',
            )
          : value[0];
        newValues[schema.fieldNames[1]] = dayjs.isDayjs(value[1])
          ? value[1].format(
              schema.props?.showTime
                ? 'YYYY-MM-DD HH:mm:ss'
                : 'YYYY-MM-DD 23:59:59',
            )
          : value[1];
      }
      if (
        value &&
        schema.fieldNames.length === 2 &&
        schema.type === 'number-range'
      ) {
        newValues[schema.fieldNames[0]] = value.min;
        newValues[schema.fieldNames[1]] = value.max;
      }
    } else if (Array.isArray(value) && schema?.fieldSplit) {
      newValues[key] = value.join(',') || undefined;
    } else if (schema && schema.isField === 2 && value) {
      const customFieldValues = createQueryItem(schema, value);
      if (customFieldValues) {
        customField.push(customFieldValues);
      }
    } else {
      newValues[key] = value === '' ? undefined : value;
    }
  });
  customField?.length
    ? (newValues.customFieldSearchStr = encodeURIComponent(
        JSON.stringify(customField),
      ))
    : '';
  console.log('customField', customField);
  return newValues;
};

function createQueryItem(schema, value): customFieldItem | null {
  const queryCondition = createQueryCondition(value, schema.type);
  if (!queryCondition) return null;
  const queryType = OUTPUT_TYPE.find((m) => m.type === schema.type)?.value;
  return {
    fieldName: schema.name,
    queryType: queryType as number,
    queryCondition: queryCondition,
  };
}

function createQueryCondition(value: any, type: string): string {
  switch (type) {
    case 'text':
      return value;
    case 'select':
      return (value && value?.join(',')) || undefined;
    case 'number-range':
      const { min = '-', max = '-' } = value || {};
      return `${min},${max}`;
    case 'date-range':
      if (Array.isArray(value) && value.length === 2) {
        return value?.join(',');
      }
    default:
      return '-';
  }
}

export const OUTPUT_TYPE = [
  { type: 'text', value: 1 },
  { type: 'number-range', value: 2 },
  { type: 'date-range', value: 3 },
  { type: 'select', value: 4 },
];
