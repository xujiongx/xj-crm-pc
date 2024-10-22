import cover1Img from '@/assets/designer/cover-1.png';
import cover2Img from '@/assets/designer/cover-2.png';
import cover3Img from '@/assets/designer/cover-3.png';
import clsx from 'clsx';
import React from 'react';
import styles from './index.less';
import { ApplyItemType } from './interface';

const DefaultCovers = [cover1Img, cover2Img, cover3Img];

export interface BaseApplyItemProp {
  type?: 'list' | 'image' | 'card' | 'title';
  index?: number;
  item: ApplyItemType;
  style?: React.CSSProperties;
  statusMap?: Record<number, string>;
  hideStatus?: boolean;
  showNumber?: boolean;
  showInfo?: boolean;
  onClick?: (item: ApplyItemType, index?: number) => void;
  renderDeadline?: (item: ApplyItemType) => React.ReactNode;
}

const BaseApplyItem = ({
  type,
  item,
  showInfo,
  showNumber,
  index,
  style,
  statusMap = { 0: '未开始', 1: '未完成', 2: '已结束', 3: '已完成' },
  hideStatus,
  onClick,
  renderDeadline,
}: BaseApplyItemProp) => {
  const prefixCls = 'desinger-apply';

  const statusNode = (item: ApplyItemType) =>
    hideStatus ? null : (
      <span
        className={clsx(styles[`${prefixCls}-status`], {
          [styles[`${prefixCls}-status-red`]]: item.new,
          [styles[`${prefixCls}-status-blue`]]: !item.new && item.status === 0,
          [styles[`${prefixCls}-status-yellow`]]:
            !item.new && item.status === 1,
          [styles[`${prefixCls}-status-green`]]: !item.new && item.status === 3,
        })}
      >
        {item.new ? 'NEW' : statusMap[item.status || 0]}
      </span>
    );

  const countNode = (index: number) =>
    showNumber && (
      <span
        className={clsx(styles[`${prefixCls}-number`], {
          [styles[`${prefixCls}-number-active`]]: index < 3,
        })}
      >
        {index + 1}
      </span>
    );

  return (
    <div
      style={style}
      onClick={() => onClick?.(item, index)}
      className={clsx(styles[`${prefixCls}-item`], {
        [styles[`${prefixCls}-item-list`]]: type === 'list',
        [styles[`${prefixCls}-item-title`]]: type === 'title',
        [styles[`${prefixCls}-item-image`]]: type === 'image',
      })}
    >
      <div className={styles[`${prefixCls}-cover`]}>
        {type !== 'title' && countNode(index || 0)}
        {<img src={item.cover || DefaultCovers[index! % 3]} />}
      </div>
      <div className={styles[`${prefixCls}-main`]}>
        <div className={styles[`${prefixCls}-title`]}>
          {type === 'title' && countNode(index || 0)}
          {showInfo && statusNode(item)}
          {item.title}
        </div>
        {showInfo && (
          <div className={styles[`${prefixCls}-desc`]}>
            {renderDeadline
              ? renderDeadline(item)
              : item.deadline
              ? `有效期至${item.deadline}`
              : '长期有效'}
          </div>
        )}
        {(item.progress || item.progress === 0) && showInfo && (
          <div className={styles[`${prefixCls}-progress`]}>
            <div className={styles[`${prefixCls}-progress-inner`]}>
              <div
                className={styles[`${prefixCls}-progress-outer`]}
                style={{ width: `${Math.min(item.progress, 100)}%` }}
              />
            </div>
            <span className={styles[`${prefixCls}-progress-title`]}>
              {item.progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseApplyItem;
