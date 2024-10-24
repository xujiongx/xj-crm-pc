import useMainStore from '@aicc/designer/es/store';
import { Select, SelectProps } from 'antd';

const ColumnSelect = ({ ...rest }: SelectProps) => {
  const linkOptions = useMainStore((store) => store.config.linkOptions);

  return <Select {...rest} placeholder="请选择栏目" options={linkOptions} />;
};

export default ColumnSelect;
