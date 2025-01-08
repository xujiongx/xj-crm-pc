import { makeTree } from '@aicc/shared';
import { Cascader, CascaderProps } from 'antd';
import { FC } from 'react';
import type { SchemaWorkOrderItem } from '../../interface';

type CascaderFactoryProps = CascaderProps & {
  schema: SchemaWorkOrderItem;
};

const CascaderFactory: FC<CascaderFactoryProps> = ({ schema, ...rest }) => {
  const { fieldContent, nullValuePrompt, fieldName } = schema;

  return (
    <Cascader
      {...rest}
      options={makeTree(JSON.parse(fieldContent || '[]'), {
        idKey: 'value',
      })}
      placeholder={nullValuePrompt || `请选择${fieldName}`}
    />
  );
};

export default CascaderFactory;
