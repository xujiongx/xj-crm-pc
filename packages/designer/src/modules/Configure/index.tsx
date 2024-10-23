import { Tabs } from 'antd';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import useMainStore from '../../store';
import ElementConfigure from './components/Element';
import ViewConfigure from './components/View';
import styles from './index.less';

const Configure = ({ className }: { className: string }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [tabActive, setTabActive] = useState('view');
  const selectedElement = useMainStore((store) => store.selectedElement);
  const hidePageStyle = useMainStore((store) => store.config.hidePageStyle);

  useEffect(() => {
    nodeRef.current?.scrollTo({ top: 0 });
    setTabActive(selectedElement ? 'component' : 'view');
  }, [selectedElement]);

  return (
    <div className={clsx(className, styles.configure)} ref={nodeRef}>
      <Tabs
        activeKey={tabActive}
        onChange={setTabActive}
        items={[
          {
            key: 'component',
            label: '组件配置',
            children: <ElementConfigure />,
            hidden: !selectedElement,
          },
          {
            key: 'view',
            label: '页面配置',
            children: <ViewConfigure />,
            hidden: hidePageStyle,
          },
        ].filter((item) => !item.hidden)}
      />
    </div>
  );
};

export default Configure;
