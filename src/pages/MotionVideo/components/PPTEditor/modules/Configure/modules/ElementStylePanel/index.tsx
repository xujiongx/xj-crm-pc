import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import ImageStylePanel from './ImageStylePanel';
import ShapeStylePanel from './ShapeStylePanel';
import TextStylePanel from './TextStylePanel';
import VideoStylePanel from './VideoStylePanel';

const ElementStylePanel = () => {
  const handleElement = useMainStore((state) => state.handleElement)();

  const StylePanelMap = {
    text: <TextStylePanel />,
    image: <ImageStylePanel />,
    video: <VideoStylePanel />,
    shape: <ShapeStylePanel />,
  };

  if (!handleElement) return null;

  return StylePanelMap[handleElement.type];
};

export default ElementStylePanel;
