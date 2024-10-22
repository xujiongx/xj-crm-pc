import clsx from 'clsx';
import styles from './index.less';
import { ApplyElementType, ApplyItemType } from './interface';
import BaseApplyItem from './item';

export interface ApplyElementProps {
  decorator?: ApplyElementType['decorator-props'];
  config?: ApplyElementType['component-props'];
  style?: React.CSSProperties;
  statusMap?: Record<number, string>;
  showTitle?: boolean;
  hideStatus?: boolean;
  renderDeadline?: (item: ApplyItemType) => React.ReactNode;
}

const BaseApply = ({
  config,
  hideStatus = false,
  statusMap = { 0: '未开始', 1: '未完成', 2: '已结束', 3: '已完成' },
  showTitle,
  renderDeadline,
}: ApplyElementProps) => {
  const prefixCls = 'desinger-apply';

  return (
    <div
      style={{ paddingTop: showTitle ? 0 : undefined }}
      className={clsx(styles[`${prefixCls}-list`], {
        [styles[`${prefixCls}-list-title`]]: config?.type === 'title',
        [styles[`${prefixCls}-list-image`]]: config?.type === 'image',
        [styles[`${prefixCls}-list-card`]]: config?.type === 'card',
      })}
    >
      {Array.from({ length: config?.showCount || 3 }).map((_, index) => {
        const item: ApplyItemType = config?.data?.[
          index % config?.data.length
        ] || {
          title: `标题${index + 1}`,
          status: 0,
        };

        return (
          <BaseApplyItem
            key={index}
            index={index}
            style={showTitle && index === 0 ? { paddingTop: 0 } : undefined}
            item={item}
            type={config?.type}
            showInfo={config?.showInfo}
            statusMap={statusMap}
            hideStatus={hideStatus}
            showNumber={config?.showNumber}
            renderDeadline={renderDeadline}
          />
        );
      })}
    </div>
  );
};

export default BaseApply;
