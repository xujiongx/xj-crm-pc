import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import AudioStylePanel from './AudioStylePanel';
import ImageStylePanel from './ImageStylePanel';
import LineStylePanel from './LineStylePanel';
import ShapeStylePanel from './ShapeStylePanel';
import TextStylePanel from './TextStylePanel';
import VideoStylePanel from './VideoStylePanel';

const ElementStylePanel = () => {
  const activeElementId = useMainStore((store) => store.activeElementId);
  const handleElement = useSlidesStore(
    (store) =>
      store.activeElements().filter((item) => item.id === activeElementId)[0],
  );

  const StylePanelMap = {
    text: <TextStylePanel />,
    image: <ImageStylePanel />,
    video: <VideoStylePanel />,
    shape: <ShapeStylePanel />,
    line: <LineStylePanel />,
    audio: <AudioStylePanel />,
  };

  if (!handleElement) return null;

  return StylePanelMap[handleElement.type];
};

export default ElementStylePanel;
