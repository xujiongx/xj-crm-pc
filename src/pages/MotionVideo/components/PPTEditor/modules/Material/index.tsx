import {
  FileImageOutlined,
  FontSizeOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import { Connection, GraphicDesign, User } from '@icon-park/react';
import clsx from 'clsx';
import React, { useState } from 'react';
import LineMaterial from './components/LineMaterial';
import Resources from './components/ResourcesMaterial';
import RobotListMaterial from './components/RobotMaterial';
import SceneMaterial from './components/SceneMaterial/index';
import ShapeMaterial from './components/ShapeMaterial';
import TextMaterial from './components/TextMaterial';
import styles from './index.less';

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const Material = ({ className }: { className: string }) => {
  const TABS: Array<TabItem> = [
    {
      key: 'scene',
      label: '场景',
      icon: <FundProjectionScreenOutlined />,
      component: <SceneMaterial />,
    },
    {
      key: 'role',
      label: '角色',
      icon: <User />,
      component: <RobotListMaterial />,
    },
    {
      key: 'text',
      label: '文字',
      icon: <FontSizeOutlined />,
      component: <TextMaterial />,
    },
    {
      key: 'shape',
      label: '形状',
      icon: <GraphicDesign />,
      component: <ShapeMaterial />,
    },
    {
      key: 'line',
      label: '线条',
      icon: <Connection />,
      component: <LineMaterial />,
    },
    {
      key: 'material',
      label: '素材',
      icon: <FileImageOutlined />,
      component: <Resources />,
    },
  ];

  const [selectedTab, setSelectedTab] = useState<TabItem>(TABS[0]);

  return (
    <div className={clsx(className, styles.material)}>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setSelectedTab(tab)}
            className={clsx(styles.tab, {
              [styles['tab-active']]: selectedTab?.key === tab.key,
            })}
          >
            <div className={styles['tab-icon']}>{tab.icon}</div>
            <div className={styles['tab-label']}>{tab.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.content}>{selectedTab?.component}</div>
    </div>
  );
};

export default Material;
