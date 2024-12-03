import { Tabs } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import useMainStore from '../../store/main';
import ElementAnimationPanel from './components/ElementAnimationPanel';
import ElementPositionPanel from './components/ElementPositionPanel';
import TextStylePanel from './components/ElementStylePanel/TextStylePanel';
import SlideDesignPanel from './components/SlideDesignPanel/index';
import { ToolbarStates } from './enum';
import styles from './index.less';
import ElementStylePanel from './components/ElementStylePanel'

const { TabPane } = Tabs;

type TabsDTO = {
  label: string;
  Key: string;
  children: React.ReactNode;
};

const elementTabs = [
  { label: '样式', key: ToolbarStates.EL_STYLE, children: <ElementStylePanel /> },
  {
    label: '位置',
    key: ToolbarStates.EL_POSITION,
    children: <ElementPositionPanel />,
  },
  {
    label: '动画',
    key: ToolbarStates.EL_ANIMATION,
    children: <ElementAnimationPanel />,
  },
];

const slideTabs = [
  {
    label: '设计',
    key: ToolbarStates.SLIDE_DESIGN,
    children: <SlideDesignPanel />,
  },
  {
    label: '切换',
    key: ToolbarStates.SLIDE_ANIMATION,
    children: <ElementPositionPanel />,
  },
  {
    label: '动画',
    key: ToolbarStates.EL_ANIMATION,
    children: <ElementAnimationPanel />,
  },
];
const multiSelectTabs = [
  { label: '样式', key: ToolbarStates.EL_STYLE, children: null },
  {
    label: '位置',
    key: ToolbarStates.MULTI_POSITION,
    children: <ElementPositionPanel />,
  },
];

const ToolBar = ({ className }: { className: string }) => {
  let activeElementIds = useMainStore((store) => store.activeElementIds);
  const currentTabs = useMemo(() => {
    if (activeElementIds.length > 1) {
      return multiSelectTabs;
    } else if (!activeElementIds?.length) {
      return slideTabs;
    } else {
      return elementTabs;
    }
  }, [activeElementIds]);
  return (
    <div className={clsx(className, styles.configure)}>
      <Tabs
        defaultActiveKey="1"
        items={currentTabs}
        centered={true}
        className={'configure-tabs'}
      >
        {currentTabs.map((e) => (
          <TabPane tab={e.label} key={e.key} className="tabPane-item">
            {e.children}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ToolBar;
