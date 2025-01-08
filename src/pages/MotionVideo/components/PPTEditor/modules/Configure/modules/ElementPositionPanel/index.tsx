import useAlignElementToCanvas from '@/pages/MotionVideo/components/PPTEditor/hooks/useAlignElementToCanvas';
import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import useOrderElement from '@/pages/MotionVideo/components/PPTEditor/hooks/useOrderElement';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import {
  ElementAlignCommands,
  ElementOrderCommands,
} from '@/pages/MotionVideo/types/edit';
import {
  AlignBottom,
  AlignLeft,
  AlignRight,
  AlignTop,
  AlignVertically,
  BringToFront,
  BringToFrontOne,
  Group,
  SendToBack,
  SentToBack,
  Ungroup,
} from '@icon-park/react';
import { Button, InputNumber } from 'antd';
import useCombineElement from '../../../../hooks/useCombineElement';
import ActionIcon from '../../../Canvas/components/ActionIcon';
import ButtonGroup from '../../components/ButtonGroup';
import Divider from '../../components/Divider';
import styles from './index.less';
const ElementPositionPanel = () => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const activeElementIds = useMainStore((state) => state.activeElementIds);

  const handleElement = useMainStore((store) => store.handleElement());

  // const handleElement =
  //   useSlidesStore((state) =>
  //     state.currentSlide().elements.find((item) => item.id === activeElementId),
  //   ) || {};
  const { orderElement } = useOrderElement();

  const { alignElementToCanvas } = useAlignElementToCanvas();

  const { canCombine, combineElements, uncombineElements } =
    useCombineElement();

  const handleUpdateElement = (data) => {
    if (!handleElement) return;
    useSlidesStore.getState().updateElement({
      id: handleElement.id,
      props: { ...data },
    });
    addHistorySnapshot();
  };

  return (
    <div className={styles['element-position-panel']}>
      <div className={styles['title']}>层级：</div>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => orderElement(handleElement!, ElementOrderCommands.TOP)}
        >
          <SendToBack className={styles['btn-icon']} /> 置顶
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() =>
            orderElement(handleElement!, ElementOrderCommands.BOTTOM)
          }
        >
          <BringToFrontOne className={styles['btn-icon']} /> 置底
        </Button>
      </ButtonGroup>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => orderElement(handleElement!, ElementOrderCommands.UP)}
        >
          <BringToFront className={styles['btn-icon']} /> 上移
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() =>
            orderElement(handleElement!, ElementOrderCommands.DOWN)
          }
        >
          <SentToBack className={styles['btn-icon']} /> 下移
        </Button>
      </ButtonGroup>

      <Divider />

      <div className={styles['title']}>对齐：</div>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.LEFT)}
        >
          <ActionIcon tooltip="左对齐" icon={<AlignLeft />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.HORIZONTAL)}
        >
          <ActionIcon tooltip="水平居中" icon={<AlignVertically />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.RIGHT)}
        >
          <ActionIcon tooltip="右对齐" icon={<AlignRight />} />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="row">
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.TOP)}
        >
          <ActionIcon tooltip="上对齐" icon={<AlignTop />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.VERTICAL)}
        >
          <ActionIcon tooltip="垂直居中" icon={<AlignVertically />} />
        </Button>
        <Button
          style={{ flex: '1' }}
          onClick={() => alignElementToCanvas(ElementAlignCommands.BOTTOM)}
        >
          <ActionIcon tooltip="下对齐" icon={<AlignBottom />} />
        </Button>
      </ButtonGroup>
      <Divider />

      {handleElement && activeElementIds.length === 1 && (
        <>
          <div className={styles['row']}>
            <InputNumber
              step={1}
              value={handleElement.left}
              addonBefore="水平"
              style={{ width: '45%', flex: '1', marginRight: '10px' }}
              onChange={(value) => handleUpdateElement({ left: value })}
            ></InputNumber>
            <InputNumber
              step={1}
              value={handleElement.top}
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
        </>
      )}

      {handleElement && activeElementIds.length > 1 && (
        <ButtonGroup className="row">
          <Button
            disabled={!canCombine}
            style={{ flex: '1' }}
            onClick={() => combineElements()}
          >
            <Group className={styles['btn-icon']} />
            组合
          </Button>
          <Button
            disabled={canCombine}
            style={{ flex: '1' }}
            onClick={() => uncombineElements()}
          >
            <Ungroup className={styles['btn-icon']} />
            取消组合
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
};

export default ElementPositionPanel;
