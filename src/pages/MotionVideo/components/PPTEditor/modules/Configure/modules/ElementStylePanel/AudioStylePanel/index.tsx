import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { PPTAudioElement } from '@/pages/MotionVideo/interface';
import { Slider } from 'antd';
import styles from './index.less';

const AudioStylePanel = () => {
  const handleElement = useMainStore(
    (state) => state.handleElement,
  )() as PPTAudioElement;

  const updateElement = useSlidesStore((state) => state.updateElement);

  const { addHistorySnapshot } = useHistorySnapshot();

  const updateAudio = (props: Partial<PPTAudioElement>) => {
    if (!handleElement) return;
    updateElement({ id: handleElement.id, props });
    addHistorySnapshot();
  };

  return (
    <div className={styles['item']}>
      <div className={styles['label']}>音频音量：</div>
      <div className={styles['value']}>
        <Slider
          min={0}
          max={2}
          step={0.1}
          value={handleElement?.volume || 1}
          onChange={(value) => updateAudio({ volume: value || 0 })}
          style={{
            width: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default AudioStylePanel;
