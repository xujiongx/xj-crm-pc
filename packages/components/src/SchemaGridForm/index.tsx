import {
  Cascader,
  Form,
  FormItemProps,
  Input,
  InputNumber,
  Select,
  TreeSelect,
} from 'antd';
import { GridForm, InputNumberRange } from 'qnzs-ui';
import { GridFormProps } from 'qnzs-ui/es/grid-form/form';
import { memo, useCallback } from 'react';
import ProRangePicker from '../ProRangePicker';
import useColumnConfig from './useColumnConfig';
import useFilterField from './useFilterField';
import useSchemaConfig from './useSchemaConfig';

export type SchemaGridFormType = {
  name: string;
  label: string;
  colSize?: number;
  hidden?: boolean;
  type?:
    | 'text'
    | 'select'
    | 'tree-select'
    | 'cascader'
    | 'date-range'
    | 'number'
    | 'number-range'
    | 'array';
  props?: any;
  children?: React.ReactNode;
  /** 表单值为数组时拼接 */
  fieldSplit?: string;
  /** 表单值为数组，自定义字段 */
  fieldNames?: Array<string>;
  /** 顺序 */
  order?: number;
  /** 是否默认显示 */
  defaultShowInSetting?: boolean;
  /** 是否模糊搜索 */
  fuzzy?: boolean;
  /** 显示配置失效 */
  disabledInSetting?: boolean;
  /** formItem的属性 */
  formProps?: FormItemProps;
  /** 是否自定义字段 2自定义字段 1通用字段 */
  isField?: number;
};

type SchemaGridFormProps = {
  schemas: SchemaGridFormType[];
} & Omit<GridFormProps, 'children'>;

const SchemaGridForm = ({ schemas, ...rest }: SchemaGridFormProps) => {
  const [form] = Form.useForm(rest.form);

  const renderContent = useCallback(
    (schema: SchemaGridFormType) => {
      if (schema.children) {
        return schema.children;
      }
      if (schema.type === 'number') {
        return (
          <InputNumber
            placeholder={`请输入${schema.label}搜索`}
            {...schema.props}
          />
        );
      }
      if (schema.type === 'number-range') {
        return <InputNumberRange {...schema.props} />;
      }
      if (schema.type === 'date-range') {
        return <ProRangePicker {...schema.props} />;
      }
      if (schema.type === 'select') {
        return (
          <Select
            allowClear
            optionFilterProp="label"
            placeholder={`请选择${schema.label}搜索`}
            maxTagCount={
              schema.props?.mode === 'multiple' ? 'responsive' : undefined
            }
            {...schema.props}
          />
        );
      }
      if (schema.type === 'cascader') {
        return (
          <Cascader
            allowClear
            placeholder={`请选择${schema.label}搜索`}
            {...schema.props}
          />
        );
      }
      if (schema.type === 'tree-select') {
        return (
          <TreeSelect
            allowClear
            placeholder={`请选择${schema.label}搜索`}
            {...schema.props}
          />
        );
      }
      return (
        <Input
          allowClear
          placeholder={`请输入${schema.label}搜索`}
          {...schema.props}
        />
      );
    },
    [schemas],
  );

  const renderItem = useCallback(
    () =>
      schemas
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((schema) => (
          <GridForm.Item
            {...schema.formProps}
            key={schema.name}
            label={schema.label}
            name={schema.name}
            hidden={schema.hidden}
          >
            {renderContent(schema)}
          </GridForm.Item>
        )),
    [schemas],
  );

  return (
    <GridForm {...rest} form={form}>
      {renderItem()}
    </GridForm>
  );
};

export default memo(SchemaGridForm);

export { useColumnConfig, useFilterField, useSchemaConfig };
