import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { PPTImageElement } from '@/pages/MotionVideo/PPTEditor/interface';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { Slider } from 'antd';
import styles from './index.less';

const ElementOpacity = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;
  const slidesStore = useSlidesStore.getState();

  const updateOpacity = (value: number) => {
    if (!handleElement) return;
    const props = { opacity: value };
    slidesStore.updateElement({ id: handleElement.id, props });
    add();
  };

  return (
    <div>
      <div className={styles['item']}>
        <div className={styles['label']}>不透明度：</div>
        <div className={styles['value']}>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={handleElement.opacity || 1}
            onChange={(value) => {
              updateOpacity(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ElementOpacity;
