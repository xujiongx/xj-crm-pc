import { MainStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/main';
import { PPTLineElement } from '@/pages/MotionVideo/interface';
import { OperateLineHandlers } from '@/pages/MotionVideo/types/edit';
import React, { useMemo } from 'react';
import Resize from '../../common/Operate/Resize';
import './index.less';

interface LineElementOperateProps {
  element: PPTLineElement;
  handlerVisible: boolean;
  dragLineElement: (
    e: React.MouseEvent,
    element: PPTLineElement,
    command: string,
  ) => void;
  store: {
    useMainStore: MainStoreType;
  };
}

const LineElementOperate = ({
  element,
  handlerVisible,
  dragLineElement,
  store,
}: LineElementOperateProps) => {
  const { useMainStore } = store;
  const canvasScale = useMainStore((store) => store.canvasScale);

  const svgWidth = Math.max(element.start[0], element.end[0]);
  const svgHeight = Math.max(element.start[1], element.end[1]);

  const resizeHandlers = useMemo(() => {
    const handlers = [
      {
        handler: OperateLineHandlers.START,
        style: {
          left: element.start[0] * canvasScale + 'px',
          top: element.start[1] * canvasScale + 'px',
        },
      },
      {
        handler: OperateLineHandlers.END,
        style: {
          left: element.end[0] * canvasScale + 'px',
          top: element.end[1] * canvasScale + 'px',
        },
      },
    ];

    if (element.curve || element.broken || element.broken2) {
      const ctrlHandler = (element.curve ||
        element.broken ||
        element.broken2) as [number, number];

      handlers.push({
        handler: OperateLineHandlers.C,
        style: {
          left: ctrlHandler[0] * canvasScale + 'px',
          top: ctrlHandler[1] * canvasScale + 'px',
        },
      });
    } else if (element.cubic) {
      const [ctrlHandler1, ctrlHandler2] = element.cubic;
      handlers.push({
        handler: OperateLineHandlers.C1,
        style: {
          left: ctrlHandler1[0] * canvasScale + 'px',
          top: ctrlHandler1[1] * canvasScale + 'px',
        },
      });
      handlers.push({
        handler: OperateLineHandlers.C2,
        style: {
          left: ctrlHandler2[0] * canvasScale + 'px',
          top: ctrlHandler2[1] * canvasScale + 'px',
        },
      });
    }

    return handlers;
  }, [element, canvasScale]);

  return (
    <div className="line-element-operate">
      {handlerVisible && (
        <>
          {resizeHandlers.map((point) => (
            <Resize
              key={point.handler}
              className="operate-resize-handler"
              style={point.style}
              onMouseDown={(e) => {
                e.stopPropagation();
                console.log('👩‍✈️', e, element, point.handler);
                dragLineElement(e, element, point.handler);
              }}
            />
          ))}

          <svg
            width={svgWidth || 1}
            height={svgHeight || 1}
            stroke={element.color}
            overflow="visible"
            style={{ transform: `scale(${canvasScale})` }}
          >
            {element.curve && (
              <g>
                <line
                  className="anchor-line"
                  x1={element.start[0]}
                  y1={element.start[1]}
                  x2={element.curve[0]}
                  y2={element.curve[1]}
                />
                <line
                  className="anchor-line"
                  x1={element.end[0]}
                  y1={element.end[1]}
                  x2={element.curve[0]}
                  y2={element.curve[1]}
                />
              </g>
            )}
            {element.cubic &&
              element.cubic.map((item, index) => (
                <g key={index}>
                  {index === 0 && (
                    <line
                      className="anchor-line"
                      x1={element.start[0]}
                      y1={element.start[1]}
                      x2={item[0]}
                      y2={item[1]}
                    />
                  )}
                  {index === 1 && (
                    <line
                      className="anchor-line"
                      x1={element.end[0]}
                      y1={element.end[1]}
                      x2={item[0]}
                      y2={item[1]}
                    />
                  )}
                </g>
              ))}
          </svg>
        </>
      )}
    </div>
  );
};

export default LineElementOperate;
