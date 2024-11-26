import {
  ExpandOutlined,
  MinusOutlined,
  PlusOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import clsx from 'clsx';
import useHistorySnapshot from '../../hooks/useHistorySnapshot';
import useScaleCanvas from '../../hooks/useScaleCanvas';
import useMainStore from '../../store/main';
import useSnapshotStore from '../../store/snapshot';
import ActionIcon from '../../modules/Canvas/components/ActionIcon';
import styles from './index.less';

const CanvasTool = ({ className }: { className: string }) => {
  const { getCanRedo, getCanUndo } = useSnapshotStore();
  const canvasScale = useMainStore((store) => store.canvasScale);
  const { redo, undo } = useHistorySnapshot();
  const { reset, scale } = useScaleCanvas();

  return (
    <div className={clsx(className, styles['canvas-tool'])}>
      <Space>
        <ActionIcon
          disabled={!getCanUndo()}
          icon={<UndoOutlined />}
          tooltip="撤销"
          onClick={undo}
        />
        <ActionIcon
          disabled={!getCanRedo()}
          icon={<RedoOutlined />}
          tooltip="重做"
          onClick={redo}
        />
      </Space>
      <Space>
        <ActionIcon icon={<MinusOutlined />} onClick={() => scale('-')} />
        <span>{Math.round(canvasScale * 100)}%</span>
        <ActionIcon icon={<PlusOutlined />} onClick={() => scale('+')} />
        <ActionIcon
          icon={<ExpandOutlined />}
          tooltip="适应屏幕"
          onClick={reset}
        />
      </Space>
    </div>
  );
};

export default CanvasTool;
