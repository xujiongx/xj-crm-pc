import { TooltipProps, ConfigProvider } from 'antd';
import clsx from 'clsx';
import { LabelTip } from 'qnzs-ui';
import React, { useContext } from 'react';
import './index.less';

interface TitleDividerProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tooltip?: React.ReactNode | TooltipProps;
}

const TitleDivider = ({
  title,
  subTitle,
  extra,
  className,
  style,
  tooltip,
}: TitleDividerProps) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('title-divider');

  return (
    <div className={clsx(prefixCls, className)} style={style}>
      <div className={`${prefixCls}-title`}>
        <LabelTip label={title} subTitle={subTitle} tooltip={tooltip} />
      </div>
      <div className={`${prefixCls}-extra`}>{extra}</div>
    </div>
  );
};

export default TitleDivider;
