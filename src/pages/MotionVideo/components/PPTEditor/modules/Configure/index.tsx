import { Tabs } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useSlidesStore } from '../../store';
import useMainStore from '../../store/main';
import SlideDesignPanel from './components/SlideDesignPanel/index';
import { ToolbarStates } from './enum';
import styles from './index.less';
import ElementAnimationPanel from './modules/ElementAnimationPanel';
import ElementPositionPanel from './modules/ElementPositionPanel';
import ElementStylePanel from './modules/ElementStylePanel';
import MultiStylePanel from './modules/ElementStylePanel/MultiStylePanel';
import ElementSwitchPanel from './modules/ElementSwitchPannel';

const { TabPane } = Tabs;

const elementTabs = [
  {
    label: '样式',
    key: ToolbarStates.EL_STYLE,
    children: <ElementStylePanel />,
  },
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
    children: <ElementSwitchPanel />,
  },
  {
    label: '动画',
    key: ToolbarStates.EL_ANIMATION,
    children: <ElementAnimationPanel />,
  },
];
const multiSelectTabs = [
  { label: '样式', key: ToolbarStates.EL_STYLE, children: <MultiStylePanel /> },
  {
    label: '位置',
    key: ToolbarStates.MULTI_POSITION,
    children: <ElementPositionPanel />,
  },
];

const ToolBar = ({ className }: { className: string }) => {
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  const activeConfigTab = useMainStore((store) => store.activeConfigTab);
  const setActiveConfigTab = useMainStore((store) => store.setActiveConfigTab);

  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const isCurSlideElement = currentSlide?.elements
    .map((item) => item.id)
    .includes(activeElementIds[0]);

  const currentTabs = useMemo(() => {
    if (activeElementIds.length > 1) {
      setActiveConfigTab(ToolbarStates.EL_STYLE);
      return multiSelectTabs;
    } else if (!activeElementIds?.length || !isCurSlideElement) {
      setActiveConfigTab(ToolbarStates.SLIDE_DESIGN);
      return slideTabs;
    } else {
      setActiveConfigTab(ToolbarStates.EL_STYLE);
      return elementTabs;
    }
  }, [activeElementIds, isCurSlideElement]);

  return (
    <div className={clsx(className, styles.configure)}>
      <Tabs
        defaultActiveKey="1"
        items={currentTabs}
        centered={true}
        className={'configure-tabs'}
        activeKey={activeConfigTab}
        onTabClick={(tab) => {
          setActiveConfigTab(tab);
        }}
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
