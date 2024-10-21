import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import clsx from 'clsx';
import React from 'react';

import DIcon from '../../../../components/Element/DIcon';
import styles from './index.less';

interface SorterItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  disabledRemove?: boolean;
  onRemove?: () => void;
  direction?: 'vertical' | 'horizontal';
}

const SorterItem = ({
  id,
  children,
  direction = 'horizontal',
  disabled: customDisabled,
  disabledRemove,
  onRemove,
}: SorterItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 999, opacity: 0.9 } : {}),
    overflow: 'hidden',
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.item, {
        [styles['item-vertical']]: direction === 'vertical',
      })}
      style={style}
      {...attributes}
    >
      {!mergedDisabled && (
        <div className={styles['item-action']}>
          <div
            className={styles['item-move']}
            ref={setActivatorNodeRef}
            {...listeners}
          >
            <DIcon type="icon-menu" />
          </div>
          <div
            className={styles['item-remove']}
            onClick={() => !disabledRemove && onRemove?.()}
          >
            {!disabledRemove && <DIcon type="icon-close" />}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SorterItem;
