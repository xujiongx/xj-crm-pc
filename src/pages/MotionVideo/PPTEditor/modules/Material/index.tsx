import IconFont from '@/components/IconFont';
import clsx from 'clsx';
import React, { useState } from 'react';
import useSlidesStore from '../../store/slides';
import ImageMaterial from './components/Resources/ImageMaterial';
import SceneMaterial from './components/SceneMaterial';
import TextMaterial from './components/TextMaterial';
import styles from './index.less';
import Resources from './components/Resources'

interface TabItem {
  key: string;
  label: string;
  icon: string;
  component: React.ReactNode;
}

const TABS: Array<TabItem> = [
  {
    key: 'scene',
    label: '场景',
    icon: 'user',
    component: <SceneMaterial />,
  },
  {
    key: 'role',
    label: '角色',
    icon: 'user',
    component: null,
  },
  {
    key: 'text',
    label: '文字',
    icon: 'user',
    component: <TextMaterial />,
  },
  {
    key: 'material',
    label: '素材',
    icon: 'user',
    component: <Resources />,
  },
  {
    key: 'shape',
    label: '形状',
    icon: 'user',
    component: null,
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
            <div className={styles['tab-icon']}>
              <IconFont type={`icon-${tab.icon}`} />
            </div>
            <div className={styles['tab-label']}>{tab.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.content}>{selectedTab?.component}</div>
    </div>
  );
};

export default Material;
