import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import {
  PPTElementShadow,
  PPTImageElement,
} from '@/pages/MotionVideo/PPTEditor/interface';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { BgColorsOutlined } from '@ant-design/icons';
import { ColorPicker, Slider, Switch } from 'antd';
import styles from './index.less';

const ElementShadow = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;
  const slidesStore = useSlidesStore.getState();
  const theme = useSlidesStore((store) => store.theme);

  const toggleShadow = (checked: boolean) => {
    if (!handleElement) return;
    if (checked) {
      const _shadow: PPTElementShadow = theme.shadow;
      slidesStore.updateElement({
        id: handleElement.id,
        props: { shadow: _shadow },
      });
    } else {
      slidesStore.removeElementProps({
        id: handleElement.id,
        propName: 'shadow',
      });
    }
    add();
  };

  const shadow = handleElement.shadow;

  const updateShadow = (shadowProps: Partial<PPTElementShadow>) => {
    if (!handleElement || !shadow) return;
    const _shadow = { ...shadow, ...shadowProps };
    slidesStore.updateElement({
      id: handleElement.id,
      props: { shadow: _shadow },
    });
    add();
  };

  return (
    <div>
      <div className={styles['switch-wrapper']}>
        <div className={styles['switch-title']}>启用阴影：</div>
        <div className={styles['switch-operate']}>
          <Switch
            value={!!handleElement.shadow}
            onChange={(v) => toggleShadow(v)}
          />
        </div>
      </div>

      {!!shadow && (
        <div>
          <div className={styles['item']}>
            <div className={styles['label']}>水平阴影：</div>
            <div className={styles['value']}>
              <Slider
                min={-10}
                max={10}
                step={1}
                value={shadow?.h}
                onChange={(value) => {
                  updateShadow({ h: value });
                }}
              />
            </div>
          </div>

          <div className={styles['item']}>
            <div className={styles['label']}>垂直阴影：</div>
            <div className={styles['value']}>
              <Slider
                min={-10}
                max={10}
                step={1}
                value={shadow?.v}
                onChange={(value) => {
                  updateShadow({ v: value });
                }}
              />
            </div>
          </div>

          <div className={styles['item']}>
            <div className={styles['label']}>模糊距离：</div>
            <div className={styles['value']}>
              <Slider
                min={-10}
                max={10}
                step={1}
                value={shadow?.blur}
                onChange={(value) => {
                  updateShadow({ blur: value });
                }}
              />
            </div>
          </div>

          <div className={styles['item']}>
            <div className={styles['label']}>阴影颜色：</div>
            <div className={styles['value']}>
              <ColorPicker
                value={shadow?.color}
                onChange={(value) =>
                  updateShadow({ color: value.toRgbString() })
                }
              >
                <div
                  className="colorPick-btn"
                  style={{
                    backgroundColor: shadow?.color,
                    width: '100%',
                  }}
                >
                  <BgColorsOutlined className="colorPick-btn-icon" />
                </div>
              </ColorPicker>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementShadow;
