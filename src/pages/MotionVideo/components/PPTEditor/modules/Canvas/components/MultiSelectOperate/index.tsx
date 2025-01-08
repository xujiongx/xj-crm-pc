import BorderLine from '@/pages/MotionVideo/elements/common/Operate/BorderLine';
import Resize from '@/pages/MotionVideo/elements/common/Operate/Resize';
import {
  OperateResizeHandlers,
  PPTElement,
} from '@/pages/MotionVideo/interface';
import { MultiSelectRange } from '@/pages/MotionVideo/types/edit';
import { getElementListRange } from '@/pages/MotionVideo/utils/element';
import { useEffect, useMemo, useRef } from 'react';
import useCommonOperate from '../../../../hooks/useCommonOperate';
import { useMainStore } from '../../../../store';
import './index.less';

const MultiSelectOperate: React.FC<{
  elementList: PPTElement[];
  scaleMultiElement: (
    e: MouseEvent,
    range: MultiSelectRange,
    command: OperateResizeHandlers,
  ) => void;
}> = ({ elementList, scaleMultiElement }) => {
  const activeElementIdList = useMainStore((store) => store.activeElementIds);
  const canvasScale = useMainStore((state) => state.canvasScale);
  const localActiveElementList = useMemo(() => {
    return elementList.filter((el) => activeElementIdList.includes(el.id));
  }, [elementList, activeElementIdList]);

  const rangeRef = useRef<MultiSelectRange>({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });

  const width = useMemo(() => {
    return (rangeRef.current.maxX - rangeRef.current.minX) * canvasScale;
  }, [rangeRef.current, canvasScale]);

  const height = useMemo(() => {
    return (rangeRef.current.maxY - rangeRef.current.minY) * canvasScale;
  }, [rangeRef.current, canvasScale]);

  const { resizeHandlers, borderLines } = useCommonOperate(width, height);

  const setRange = () => {
    const { minX, maxX, minY, maxY } = getElementListRange(
      localActiveElementList,
    );
    rangeRef.current = { minX, maxX, minY, maxY };
  };

  useEffect(() => {
    setRange();
  }, [localActiveElementList]);

  const disableResize = useMemo(() => {
    return localActiveElementList.some((item) => {
      if ((item.type === 'image' || item.type === 'shape') && !item.rotate)
        return false;
      return true;
    });
  }, [localActiveElementList]);

  return (
    <div
      className="multi-select-operate"
      style={{
        left: rangeRef.current.minX * canvasScale + 'px',
        top: rangeRef.current.minY * canvasScale + 'px',
      }}
    >
      {borderLines.map((line) => (
        <BorderLine key={line.type} type={line.type} style={line.style} />
      ))}

      {!disableResize &&
        resizeHandlers.map((point) => (
          <Resize
            key={point.direction}
            type={point.direction}
            style={point.style}
            onMouseDown={(e) =>
              scaleMultiElement(e, rangeRef.current, point.direction)
            }
          />
        ))}
    </div>
  );
};

export default MultiSelectOperate;
