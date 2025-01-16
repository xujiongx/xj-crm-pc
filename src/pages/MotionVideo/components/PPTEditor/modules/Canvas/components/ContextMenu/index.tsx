import { useClickAway, useEventListener } from 'ahooks';
import { Menu, MenuProps } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './index.less';

interface ContextMenuClickFn {
  [key: string]: (...args: any[]) => any;
}

const BaseSize: React.CSSProperties = {
  display: 'none',
  top: 0,
  left: 0,
};

const ContextMenu = ({
  menuItems,
  targetEl,
  contextMenuClickFn,
  defaultAction,
}: {
  menuItems: MenuProps['items'];
  targetEl: HTMLDivElement;
  contextMenuClickFn: ContextMenuClickFn;
  defaultAction?: () => any;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(BaseSize);

  useClickAway(() => {
    setSize(BaseSize);
  }, containerRef);

  useEventListener('contextmenu', (e) => {
    e.preventDefault();
    // 不在目标范围的 context ，直接 return
    if (!targetEl?.contains(e.target as Node)) {
      setSize(BaseSize);
      return false;
    }
    if (defaultAction) defaultAction();
    setSize({
      display: 'block',
      top: e.clientY,
      left: e.clientX,
    });
  });

  return (
    <div
      id="contextMenuID"
      ref={containerRef}
      className={styles['context-menu']}
      style={size}
    >
      <Menu
        onClick={(e) => {
          contextMenuClickFn[e.key]();
          setSize(BaseSize);
        }}
        selectedKeys={[]}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        items={menuItems}
      />
    </div>
  );
};

export default ContextMenu;
