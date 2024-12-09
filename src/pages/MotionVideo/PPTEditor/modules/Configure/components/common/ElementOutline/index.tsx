import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import {
  PPTElementOutline,
  PPTImageElement,
} from '@/pages/MotionVideo/PPTEditor/interface';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { BgColorsOutlined } from '@ant-design/icons';
import { ColorPicker, InputNumber, Select, Switch } from 'antd';
import styles from './index.less';

const ElementOutline = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;
  const slidesStore = useSlidesStore.getState();

  const theme = useSlidesStore((store) => store.theme);

  const outline = handleElement.outline;

  const toggleOutline = (checked: boolean) => {
    if (!handleElement) return;
    if (checked) {
      const _outline: PPTElementOutline = theme.outline;
      slidesStore.updateElement({
        id: handleElement.id,
        props: { outline: _outline },
      });
    } else {
      slidesStore.removeElementProps({
        id: handleElement.id,
        propName: 'outline',
      });
    }
    add();
  };

  const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {
    if (!handleElement) return;

    const props = { outline: { ...outline, ...outlineProps } };
    slidesStore.updateElement({ id: handleElement.id, props });
    add();
  };

  return (
    <div>
      <div className={styles['switch-wrapper']}>
        <div className={styles['switch-title']}>启用边框：</div>
        <div className={styles['switch-operate']}>
          <Switch
            value={!!handleElement.outline}
            onChange={(v) => toggleOutline(v)}
          />
        </div>
      </div>

      {!!handleElement.outline && (
        <div>
          <div className={styles['item']}>
            <div className={styles['label']}>边框样式：</div>
            <div className={styles['value']}>
              <Select
                style={{
                  width: '100%',
                }}
                value={handleElement.outline?.style || 'solid'}
                onChange={(value) => {
                  updateOutline({
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
            <div className={styles['label']}>边框颜色：</div>
            <div className={styles['value']}>
              <ColorPicker
                value={outline?.color}
                onChange={(value) =>
                  updateOutline({ color: value.toRgbString() })
                }
              >
                <div
                  className="colorPick-btn"
                  style={{
                    backgroundColor: outline?.color,
                    width: '100%',
                  }}
                >
                  <BgColorsOutlined className="colorPick-btn-icon" />
                </div>
              </ColorPicker>
            </div>
          </div>

          <div className={styles['item']}>
            <div className={styles['label']}>边框粗细：</div>
            <div className={styles['value']}>
              <InputNumber
                min={0}
                max={30}
                value={outline?.width || 1}
                onChange={(value) => updateOutline({ width: value || 0 })}
                style={{
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementOutline;
