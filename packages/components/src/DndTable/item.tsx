import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { theme } from 'antd';
import React, { memo } from 'react';
interface SortableItemProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const SortableItem = ({ children, ...props }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(props['data-row-key']),
  });
  const { token } = theme.useToken();

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 10,
          backgroundColor: '#fff',
          boxShadow: token.boxShadow,
        }
      : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        const item = child as React.ReactElement;
        if (item.key === 'sort' || item.props?.dataIndex === 'sort') {
          return React.cloneElement(item, {
            children: (
              <HolderOutlined
                ref={setActivatorNodeRef}
                style={{
                  padding: 4,
                  cursor: 'grab',
                  color: token.colorTextSecondary,
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

export default memo(SortableItem);
