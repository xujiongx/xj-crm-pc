import { SHAPE_LIST, ShapePoolItem } from '@/pages/MotionVideo/config/shapes';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useCreateElement from '../../../../hooks/useCreateElement';
import { VIEWPORT_SIZE } from '../../../../hooks/useViewportSize';
import { useMainStore } from '../../../../store';
import ShapeItemThumbnail from './ShapeItemThumbnail';
import './index.less';

const ShapePool = () => {
  const setCreatingCustomShapeState = useMainStore(
    (state) => state.setCreatingCustomShapeState,
  );

  const viewportRatio = useMainStore((store) => store.viewportRatio);

  const { createShapeElement } = useCreateElement();

  const selectShape = (shape: ShapePoolItem) => {
    const size = 200;
    createShapeElement(
      {
        left: (VIEWPORT_SIZE - size) / 2,
        top: (VIEWPORT_SIZE * viewportRatio - size) / 2,
        width: size,
        height: size,
      },
      shape,
    );
  };

  const handleDraw = () => {
    setCreatingCustomShapeState(true);
  };

  return (
    <>
      <div className="add">
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={handleDraw}
        >
          自由绘制
        </Button>
      </div>
      <div className="shape-pool">
        {SHAPE_LIST.map((item) => (
          <div className="category" key={item.type}>
            <div className="category-name">{item.type}</div>
            <div className="shape-list">
              {item.children.map((shape, index) => (
                <ShapeItemThumbnail
                  className="shape-item"
                  key={index}
                  shape={shape}
                  onClick={() => selectShape(shape)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShapePool;
