import { Select, SelectProps } from 'antd';
import useMainStore from '../../../store';

const ColumnSelect = ({ ...rest }: SelectProps) => {
  const linkOptions = useMainStore((store) => store.config.linkOptions);

  return <Select {...rest} placeholder="请选择栏目" options={linkOptions} />;
};

export default ColumnSelect;
