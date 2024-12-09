import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { PPTImageElement } from '@/pages/MotionVideo/PPTEditor/interface';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import { BgColorsOutlined } from '@ant-design/icons';
import { ColorPicker, Switch } from 'antd';
import styles from './index.less';

const defaultColorMask = 'rgba(226, 83, 77, 0.5)';
const ElementColorMask = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;

  const handleElementId = useMainStore((state) => state.activeElementId);

  const slidesStore = useSlidesStore.getState();
  const toggleColorMask = (checked: boolean) => {
    if (!handleElement) return;
    if (checked) {
      slidesStore.updateElement({
        id: handleElement.id,
        props: { colorMask: defaultColorMask },
      });
    } else {
      slidesStore.removeElementProps({
        id: handleElement.id,
        propName: 'colorMask',
      });
    }
    add();
  };

  const updateColorMask = (colorMask: string) => {
    slidesStore.updateElement({
      id: handleElementId,
      props: { colorMask },
    });
    add();
  };

  return (
    <div>
      <div className={styles['switch-wrapper']}>
        <div className={styles['switch-title']}>着色（蒙版）：</div>
        <div className={styles['switch-operate']}>
          <Switch
            value={!!handleElement.colorMask}
            onChange={(v) => toggleColorMask(v)}
          />
        </div>
      </div>
      {!!handleElement.colorMask && (
        <div className={styles['item']}>
          <div className={styles['label']}>蒙版颜色：</div>
          <div className={styles['value']}>
            <ColorPicker
              value={handleElement.colorMask}
              onChange={(color) => updateColorMask(color.toRgbString())}
            >
              <div
                className="colorPick-btn"
                style={{
                  backgroundColor: handleElement.colorMask,
                  width: '100%',
                }}
              >
                <BgColorsOutlined className="colorPick-btn-icon" />
              </div>
            </ColorPicker>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementColorMask;
