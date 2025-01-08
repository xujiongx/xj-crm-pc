import { TreeSelectProps } from 'antd';
import React from 'react';
import DepartmetTreeSelect from './department';

type ServiceSourceType = 'department';

interface OnlineSelectProps extends TreeSelectProps {
  source: ServiceSourceType;
}

const OnlineTreeSelect: React.FC<OnlineSelectProps> = ({
  source,
  ...props
}) => {
  if (source === 'department') {
    return <DepartmetTreeSelect {...props} />;
  }
};

export default OnlineTreeSelect;
