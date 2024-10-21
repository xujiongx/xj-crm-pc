import { TitleElementType } from '@/pages/Setting/Designer/Mobile/QNDesignCore/interface';
import { RightOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import DIcon from '../DIcon';
import { DefaultTitleConfig } from './constants';
import './index.less';

interface TitleElementProps {
  config?: TitleElementType['component-props'];
  style?: React.CSSProperties;
}

const TitleElement = ({
  style,
  config = DefaultTitleConfig['component-props'],
}: TitleElementProps) => {
  const prefixCls = 'desinger-title';

  return (
    <div style={style} className={clsx(`${prefixCls}-wrapper`)}>
      <div
        className={`${prefixCls}-title`}
        style={{
          color: config?.color,
          fontSize: config?.fontSize,
          fontWeight: config?.fontWeight ? 600 : 'normal',
        }}
      >
        {config?.icon &&
          (config?.icon === 'icon-2' ? (
            <span
              className={`${prefixCls}-division`}
              style={{
                backgroundColor: config?.iconColor,
                height: parseInt(config?.fontSize || '16px') - 2,
              }}
            />
          ) : (
            <span
              className={`${prefixCls}-icon`}
              style={{ color: config?.iconColor }}
            >
              <DIcon type={`icon-${config?.icon}`} />
            </span>
          ))}
        <span>{config?.title}</span>
      </div>

      {config?.more && (
        <div className={`${prefixCls}-more`}>
          {config.more}{' '}
          {(config.moreLink || config.moreColumn) && <RightOutlined />}
        </div>
      )}
    </div>
  );
};

export default TitleElement;
