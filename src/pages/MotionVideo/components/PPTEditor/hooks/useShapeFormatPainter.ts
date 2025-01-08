import { PPTShapeElement } from '@/pages/MotionVideo/interface';
import { useMainStore, useSlidesStore } from '../store';

const useShapeFormatPainter = () => {
  const shapeFormatPainter = useMainStore((store) => store.shapeFormatPainter);
  const setShapeFormatPainter = useMainStore(
    (store) => store.setShapeFormatPainter,
  );

  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTShapeElement;

  const toggleShapeFormatPainter = (keep = false) => {
    const _handleElement = handleElement;

    if (shapeFormatPainter) {
      setShapeFormatPainter(null);
    } else {
      setShapeFormatPainter({
        keep,
        fill: _handleElement?.fill,
        gradient: _handleElement?.gradient,
        outline: _handleElement?.outline,
        opacity: _handleElement?.opacity,
        shadow: _handleElement?.shadow,
      });
    }
  };

  return {
    toggleShapeFormatPainter,
  };
};

export default useShapeFormatPainter;
