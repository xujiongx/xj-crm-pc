import ImageUploader from '@/pages/MotionVideo/PPTEditor/components/Uploader/image';
import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { PPTVideoElement } from '@/pages/MotionVideo/PPTEditor/interface';
import { useMainStore } from '@/pages/MotionVideo/PPTEditor/store';
import useSlidesStore from '@/pages/MotionVideo/PPTEditor/store/slides';
import { Button } from 'antd';

const VideoStylePanel = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTVideoElement;

  const handleElementId = useMainStore((state) => state.activeElementId);

  const updateVideo = (props: Partial<PPTVideoElement>) => {
    if (!handleElement) return;
    useSlidesStore.getState().updateElement({ id: handleElementId, props });
    add();
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
