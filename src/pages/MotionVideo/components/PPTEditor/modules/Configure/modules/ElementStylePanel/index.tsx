import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import ImageStylePanel from './ImageStylePanel';
import ShapeStylePanel from './ShapeStylePanel';
import TextStylePanel from './TextStylePanel';
import VideoStylePanel from './VideoStylePanel';

const ElementStylePanel = () => {
  const activeElementId = useMainStore((state) => state.activeElementId);
  const handleElement =
    useSlidesStore((state) =>
      state.currentSlide().elements.find((item) => item.id === activeElementId),
    ) || {};

  const StylePanelMap = {
    text: <TextStylePanel />,
    image: <ImageStylePanel />,
    video: <VideoStylePanel />,
    shape: <ShapeStylePanel />,
  };

  return StylePanelMap[handleElement.type];
};

export default ElementStylePanel;
