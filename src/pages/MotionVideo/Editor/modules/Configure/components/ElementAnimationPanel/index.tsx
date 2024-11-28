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
          <Button type="primary">添加动画</Button>
        </Popover>
      ) : (
        <div>请选择元素</div>
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
