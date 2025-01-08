import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import useSlidesStore from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import ImageUploader from '@/pages/MotionVideo/components/Uploader/image';
import { PPTVideoElement } from '@/pages/MotionVideo/interface';
import { Button } from 'antd';

const VideoStylePanel = () => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTVideoElement;

  const handleElementId = useMainStore((state) => state.activeElementId);

  const updateVideo = (props: Partial<PPTVideoElement>) => {
    if (!handleElement) return;
    useSlidesStore.getState().updateElement({ id: handleElementId, props });
    addHistorySnapshot();
  };

  return (
    <div className="video-style-panel">
      <div className="title">视频预览封面</div>
      <div
        style={{
          height: '100px',
        }}
      >
        <ImageUploader
          value={handleElement?.poster}
          onChange={(v) => {
            updateVideo({ poster: v });
          }}
        />
      </div>

      <Button
        style={{ width: '100%', marginTop: '12px' }}
        onClick={() => updateVideo({ poster: '' })}
      >
        重置封面
      </Button>
    </div>
  );
};

export default VideoStylePanel;
