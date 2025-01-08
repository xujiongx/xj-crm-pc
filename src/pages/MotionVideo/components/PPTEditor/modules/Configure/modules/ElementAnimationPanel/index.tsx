import { Click, Effects } from '@icon-park/react';
import { Button, Popover } from 'antd';
import AddAnimationPop from './AddAnimationPop';
import ElementAnimationList from './ElementAnimationList';
import { useElementAnimationPanel } from './hooks';

const ElementAnimationPanel = () => {
  const {
    handleElementId,
    curElementAnimations,
    handleAddAnimation,
    deleteAnimation,
    updateAnimation,
    manualRunAnimation,
  } = useElementAnimationPanel();

  return (
    <div className="element-animation-panel">
      {handleElementId ? (
        <Popover
          content={<AddAnimationPop handleAddAnimation={handleAddAnimation} />}
          trigger="click"
          placement="bottomRight"
        >
          <Button style={{ width: '100%' }}>
            <Effects />
            添加动画
          </Button>
        </Popover>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Click theme="outline" style={{ marginRight: '4px' }} />
          选中页面中的元素添加动画
        </div>
      )}
      <ElementAnimationList
        list={curElementAnimations}
        deleteAnimation={deleteAnimation}
        updateAnimation={updateAnimation}
        manualRunAnimation={manualRunAnimation}
      />
    </div>
  );
};

export default ElementAnimationPanel;
