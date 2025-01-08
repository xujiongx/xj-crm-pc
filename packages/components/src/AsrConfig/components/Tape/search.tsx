import { FC } from 'react';
import { FormInstance } from 'antd';
import SchemaGridForm from '../../../SchemaGridForm';
import { RecordStatus } from '../../constant';
import { Audit_Result } from './index';

interface SearchProps {
  form: FormInstance;
  channels: { title: string; key: string }[];
  knowledgeType: { label: string; value: number }[];
  onSearch: () => void;
  machineCoupling?: boolean;
}

const Search: FC<SearchProps> = ({
  knowledgeType,
  channels,
  form,
  onSearch,
  machineCoupling = false,
}) => (
  <SchemaGridForm
    form={form}
    onFinish={onSearch}
    schemas={[
      {
        label: '知识类型',
        name: 'recordType',
        type: 'select',
        props: {
          options: knowledgeType,
        },
      },
      {
        label: '知识名称',
        name: 'name',
      },
      {
        label: '语种',
        name: 'langType',
        type: 'select',
        props: {
          options: channels,
          showSearch: true,
          optionFilterProp: 'title',
          fieldNames: { label: 'title', value: 'key' },
        },
        hidden: machineCoupling,
      },
      {
        label: '是否录音',
        name: 'isRecord',
        type: 'select',
        props: {
          options: RecordStatus,
        },
      },
      {
        label: '审核结果',
        name: 'auditResult',
        type: 'select',
        props: {
          options: Audit_Result,
        },
        hidden: !machineCoupling,
      },
      {
        label: '差异分值',
        name: 'score',
        type: 'number-range',
        props: {
          min: 0,
          max: 1,
          step: 0.1,
          precision: 3,
          formatter: (value: string) => (value ? parseFloat(value) : value),
        },
        hidden: machineCoupling,
      },
      {
        label: '机器人话术',
        name: 'contentText',
      },
    ]}
  />
);

export default Search;
