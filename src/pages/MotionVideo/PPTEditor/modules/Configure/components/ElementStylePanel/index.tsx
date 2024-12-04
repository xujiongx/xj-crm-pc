import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import ImageStylePanel from './ImageStylePanel';
import TextStylePanel from './TextStylePanel';
import VideoStylePanel from './VideoStylePanel'

const ElementStylePanel = () => {
  const handleElementId = useMainStore((store) => store.activeElementId);
  const handleElement = useSlidesStore((store) => store.activeElements)()?.[0];

  const StylePanelMap = {
    text: <TextStylePanel />,
    image: <ImageStylePanel />,
    video: <VideoStylePanel />,
  };

  console.log('👗', handleElement.type);
  return StylePanelMap[handleElement.type];
};

export default ElementStylePanel;
