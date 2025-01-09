import { LINE_LIST, LinePoolItem } from '@/pages/MotionVideo/config/lines';
import LinePointMarker from '@/pages/MotionVideo/elements/Element/Line/LinePointMarker';
import useCreateElement from '../../../../hooks/useCreateElement';
import { VIEWPORT_SIZE } from '../../../../hooks/useViewportSize';
import { useMainStore } from '../../../../store';
import './index.less';

const LineMaterial = () => {
  const { createLineElement } = useCreateElement();
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const selectLine = (line: LinePoolItem) => {
    const size = 200;
    console.log('👩‍🍳', line);
    createLineElement(
      {
        left: (VIEWPORT_SIZE - size) / 2,
        top: (VIEWPORT_SIZE * viewportRatio - size) / 2,
        start: [0, 0],
        end: [size, size],
      },
      line,
    );
  };

  return (
    <div className="line-pool">
      {LINE_LIST.map((item, i) => (
        <div className="category" key={item.type}>
          <div className="category-name">{item.type}</div>
          <div className="line-list">
            {item.children.map((line, j) => (
              <div className="line-item" key={j}>
                <div className="line-content" onClick={() => selectLine(line)}>
                  <svg overflow="visible" width="20" height="20">
                    <defs>
                      {line.points[0] && (
                        <LinePointMarker
                          className="line-marker"
                          id={`preset-line-${i}-${j}`}
                          position="start"
                          type={line.points[0]}
                          color="currentColor"
                          baseSize={2}
                        />
                      )}
                      {line.points[1] && (
                        <LinePointMarker
                          className="line-marker"
                          id={`preset-line-${i}-${j}`}
                          position="end"
                          type={line.points[1]}
                          color="currentColor"
                          baseSize={2}
                        />
                      )}
                    </defs>
                    <path
                      className="line-path"
                      d={line.path}
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray={line.style === 'solid' ? '0, 0' : '4, 1'}
                      markerStart={
                        line.points[0]
                          ? `url(#preset-line-${i}-${j}-${line.points[0]}-start)`
                          : ''
                      }
                      markerEnd={
                        line.points[1]
                          ? `url(#preset-line-${i}-${j}-${line.points[1]}-end)`
                          : ''
                      }
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LineMaterial;
