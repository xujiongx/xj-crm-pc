import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { PPTLineElement } from '@/pages/MotionVideo/interface';
import { BgColorsOutlined } from '@ant-design/icons';
import { Switch } from '@icon-park/react';
import { Button, ColorPicker, Divider, InputNumber, Select } from 'antd';
import ElementShadow from '../../../components/common/ElementShadow';
import styles from './index.less';
const LineStylePanel = () => {
  const handleElement = useMainStore(
    (state) => state.handleElement,
  )() as PPTLineElement;

  const updateElement = useSlidesStore((state) => state.updateElement);
  const { addHistorySnapshot } = useHistorySnapshot();
  const updateLine = (props: Partial<PPTLineElement>) => {
    if (!handleElement) return;
    updateElement({ id: handleElement.id, props });
    addHistorySnapshot();
  };

  if (!handleElement) return null;

  return (
    <div>
      <div className={styles['item']}>
        <div className={styles['label']}>边框样式：</div>
        <div className={styles['value']}>
          <Select
            style={{
              width: '100%',
            }}
            value={handleElement?.style || 'solid'}
            onChange={(value) => {
              updateLine({
                style: value as 'dashed' | 'solid' | 'dotted',
              });
            }}
            options={[
              { label: '实线边框', value: 'solid' },
              { label: '虚线边框', value: 'dashed' },
              { label: '点线边框', value: 'dotted' },
            ]}
          />
        </div>
      </div>
      <div className={styles['item']}>
        <div className={styles['label']}>线条颜色：</div>
        <div className={styles['value']}>
          <ColorPicker
            value={handleElement?.color}
            onChange={(value) => updateLine({ color: value.toRgbString() })}
          >
            <div
              className="color-pick-btn"
              style={{
                backgroundColor: handleElement?.color,
                width: '100%',
              }}
            >
              <BgColorsOutlined className="color-pick-btn-icon" />
            </div>
          </ColorPicker>
        </div>
      </div>
      <div className={styles['item']}>
        <div className={styles['label']}>线条粗细：</div>
        <div className={styles['value']}>
          <InputNumber
            min={0}
            max={30}
            value={handleElement?.width || 0}
            onChange={(value) => updateLine({ width: value || 0 })}
            style={{
              width: '100%',
            }}
          />
        </div>
      </div>
      <div className={styles['item']}>
        <div className={styles['label']}>起点样式：</div>
        <div className={styles['value']}>
          <Select
            style={{
              width: '100%',
            }}
            value={handleElement.points[0]}
            onChange={(value) => {
              updateLine({
                points: [value, handleElement.points[1]],
              });
            }}
            options={[
              { label: '无', value: '' },
              { label: '箭头', value: 'arrow' },
              { label: '圆点', value: 'dot' },
            ]}
          />
        </div>
      </div>
      <div className={styles['item']}>
        <div className={styles['label']}>终点样式：</div>
        <div className={styles['value']}>
          <Select
            style={{
              width: '100%',
            }}
            value={handleElement.points[1]}
            onChange={(value) => {
              updateLine({
                points: [handleElement.points[0], value],
              });
            }}
            options={[
              { label: '无', value: '' },
              { label: '箭头', value: 'arrow' },
              { label: '圆点', value: 'dot' },
            ]}
          />
        </div>
      </div>
      <Divider />
      <Button
        style={{ width: '100%' }}
        onClick={() =>
          updateLine({
            start: handleElement.end,
            end: handleElement.start,
          })
        }
      >
        <Switch />
        交换方向
      </Button>
      <Divider />
      <ElementShadow />
    </div>
  );
};

export default LineStylePanel;
