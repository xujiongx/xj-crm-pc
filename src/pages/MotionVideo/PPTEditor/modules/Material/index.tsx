import {
  FileImageOutlined,
  FontSizeOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import useSlidesStore from '../../store/slides';
import Resources from './components/ResourcesMaterial';
import SceneMaterial from './components/SceneMaterial/index';
import TextMaterial from './components/TextMaterial';
import styles from './index.less';

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const TABS: Array<TabItem> = [
  {
    key: 'scene',
    label: '场景',
    icon: <FundProjectionScreenOutlined />,
    component: <SceneMaterial />,
  },
  // {
  //   key: 'role',
  //   label: '角色',
  //   icon: 'user',
  //   component: null,
  // },
  {
    key: 'text',
    label: '文字',
    icon: <FontSizeOutlined />,
    component: <TextMaterial />,
  },
  // {
  //   key: 'shape',
  //   label: '形状',
  //   icon: 'user',
  //   component: null,
  // },
  {
    key: 'material',
    label: '素材',
    icon: <FileImageOutlined />,
    component: <Resources />,
  },
];

const Material = ({ className }: { className: string }) => {
  const [selectedTab, setSelectedTab] = useState<TabItem>(TABS[0]);
  const slideIndex = useSlidesStore((store) => store.slideIndex);

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
