import useAlignElementToCanvas from '@/pages/MotionVideo/PPTEditor/hooks/useAlignElementToCanvas';
import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import useOrderElement from '@/pages/MotionVideo/PPTEditor/hooks/useOrderElement';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import {
  ElementAlignCommands,
  ElementOrderCommands,
} from '@/pages/MotionVideo/PPTEditor/types/edit';
import { ColumnHeightOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';
import ActionIcon from '../../../Canvas/components/ActionIcon';
import ButtonGroup from '../ButtonGroup';
import Divider from '../Divider';
import styles from './index.less';
const ElementPositionPanel = () => {
  const { add } = useHistorySnapshot();
  const activeElementId = useMainStore((state) => state.activeElementId);

  const handleElement =
    useSlidesStore((state) =>
      state.currentSlide().elements.find((item) => item.id === activeElementId),
    ) || {};
  const { orderElement } = useOrderElement();

  const { alignElementToCanvas } = useAlignElementToCanvas();

  const handleUpdateElement = (data) => {
    useSlidesStore.getState().updateElement({
      id: handleElement.id,
      props: { ...data },
    });
    add();
  };

  console.log('💁handleElement', handleElement);

  return (
    <div className={styles['element-position-panel']}>
      <div className={styles['title']}>层级：</div>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => orderElement(handleElement!, ElementOrderCommands.TOP)}
        >
          <ColumnHeightOutlined className="btn-icon" /> 置顶
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() =>
            orderElement(handleElement!, ElementOrderCommands.BOTTOM)
          }
        >
          <ColumnHeightOutlined className="btn-icon" /> 置底
        </Button>
      </ButtonGroup>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => orderElement(handleElement!, ElementOrderCommands.UP)}
        >
          <ColumnHeightOutlined className="btn-icon" /> 上移
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() =>
            orderElement(handleElement!, ElementOrderCommands.DOWN)
          }
        >
          <ColumnHeightOutlined className="btn-icon" /> 下移
        </Button>
      </ButtonGroup>

      <Divider />

      <div className={styles['title']}>对齐：</div>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.LEFT)}
        >
          <ActionIcon tooltip="左对齐" icon={<ColumnHeightOutlined />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.HORIZONTAL)}
        >
          <ActionIcon tooltip="水平居中" icon={<ColumnHeightOutlined />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.RIGHT)}
        >
          <ActionIcon tooltip="右对齐" icon={<ColumnHeightOutlined />} />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.TOP)}
        >
          <ActionIcon tooltip="上对齐" icon={<ColumnHeightOutlined />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.VERTICAL)}
        >
          <ActionIcon tooltip="垂直居中" icon={<ColumnHeightOutlined />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.BOTTOM)}
        >
          <ActionIcon tooltip="下对齐" icon={<ColumnHeightOutlined />} />
        </Button>
      </ButtonGroup>
      <Divider />

      <div className={styles['row']}>
        <InputNumber
          value={handleElement.left}
          step={0.1}
          addonBefore="水平"
          style={{ width: '45%', flex: '1', marginRight: '10px' }}
          onChange={(value) => handleUpdateElement({ left: value })}
        ></InputNumber>
        <InputNumber
          value={handleElement.top}
          step={0.1}
          addonBefore="垂直"
          style={{ width: '45%', flex: '1' }}
          onChange={(value) => handleUpdateElement({ top: value })}
        ></InputNumber>
      </div>
      <div className={styles['row']}>
        <InputNumber
          value={handleElement.width}
          step={1}
          addonBefore="宽度"
          style={{ width: '45%', flex: '1', marginRight: '10px' }}
          onChange={(value) => handleUpdateElement({ width: value })}
        ></InputNumber>
        {handleElement?.height && (
          <InputNumber
            value={handleElement.height}
            step={1}
            addonBefore="高度"
            style={{ width: '45%', flex: '1' }}
            onChange={(value) => handleUpdateElement({ height: value })}
          ></InputNumber>
        )}
      </div>
    </div>
  );
};

export default ElementPositionPanel;
