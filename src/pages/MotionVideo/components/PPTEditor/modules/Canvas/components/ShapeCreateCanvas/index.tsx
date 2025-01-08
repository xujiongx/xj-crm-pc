import { KEYS } from '@/pages/MotionVideo/config/hotkey';
import { CreateCustomShapeData } from '@/pages/MotionVideo/types/edit';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  useKeyboardStore,
  useMainStore,
  useSlidesStore,
} from '../../../../store';
import styles from './index.less';

interface ShapeCreateCanvasProps {
  created: (data: CreateCustomShapeData) => void;
}

const ShapeCreateCanvas: React.FC<ShapeCreateCanvasProps> = ({ created }) => {
  const shapeCanvasRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(
    null,
  );
  const [points, setPoints] = useState<[number, number][]>([]);
  const [closed, setClosed] = useState(false);

  const ctrlOrShiftKeyActive = useKeyboardStore(
    (store) => store.ctrlKeyState || store.shiftKeyState,
  );

  const theme = useSlidesStore((store) => store.theme);

  const setCreatingCustomShapeState = useMainStore(
    (state) => state.setCreatingCustomShapeState,
  );

  useEffect(() => {
    if (!shapeCanvasRef.current) return;
    const { x, y } = shapeCanvasRef.current.getBoundingClientRect();
    setOffset({ x, y });
  }, []);

  const getPoint = (e: MouseEvent, custom = false) => {
    let pageX = e.pageX - offset.x;
    let pageY = e.pageY - offset.y;

    if (custom) return { pageX, pageY };

    if (ctrlOrShiftKeyActive && points.length) {
      const [lastPointX, lastPointY] = points[points.length - 1];
      if (Math.abs(lastPointX - pageX) - Math.abs(lastPointY - pageY) > 0) {
        pageY = lastPointY;
      } else pageX = lastPointX;
    }
    return { pageX, pageY };
  };

  const updateMousePosition = (e: MouseEvent) => {
    if (isMouseDown) {
      const { pageX, pageY } = getPoint(e, true);
      setPoints((prevPoints) => [...prevPoints, [pageX, pageY]]);
      setMousePosition(null);
      return;
    }

    const { pageX, pageY } = getPoint(e);
    setMousePosition([pageX, pageY]);

    if (points.length >= 2) {
      const [firstPointX, firstPointY] = points[0];
      if (
        Math.abs(firstPointX - pageX) < 5 &&
        Math.abs(firstPointY - pageY) < 5
      ) {
        setClosed(true);
      } else setClosed(false);
    } else setClosed(false);
  };

  const path = () => {
    let d = '';
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (i === 0) d += `M ${point[0]} ${point[1]} `;
      else d += `L ${point[0]} ${point[1]} `;
    }
    if (points.length && mousePosition) {
      d += `L ${mousePosition[0]} ${mousePosition[1]}`;
    }
    return d;
  };

  const getCreateData = (close = true) => {
    const xList = points.map((item) => item[0]);
    const yList = points.map((item) => item[1]);
    const minX = Math.min(...xList);
    const minY = Math.min(...yList);
    const maxX = Math.max(...xList);
    const maxY = Math.max(...yList);

    const formatedPoints = points.map((point) => {
      return [point[0] - minX, point[1] - minY];
    });

    let path = '';
    for (let i = 0; i < formatedPoints.length; i++) {
      const point = formatedPoints[i];
      if (i === 0) path += `M ${point[0]} ${point[1]} `;
      else path += `L ${point[0]} ${point[1]} `;
    }
    if (close) path += 'Z';

    const start: [number, number] = [minX + offset.x, minY + offset.y];
    const end: [number, number] = [maxX + offset.x, maxY + offset.y];
    const viewBox: [number, number] = [maxX - minX, maxY - minY];

    return {
      start,
      end,
      path,
      viewBox,
    };
  };

  const addPoint = (e: MouseEvent) => {
    const { pageX, pageY } = getPoint(e);
    setIsMouseDown(true);

    if (closed) created(getCreateData());
    else setPoints((prevPoints) => [...prevPoints, [pageX, pageY]]);

    document.onmouseup = () => {
      setIsMouseDown(false);
    };
  };

  const close = () => {
    setCreatingCustomShapeState(false);
  };

  const create = () => {
    created({
      ...getCreateData(false),
      fill: 'rgba(0, 0, 0, 0)',
      outline: {
        width: 2,
        color: theme?.themeColor,
        style: 'solid',
      },
    });
    close();
  };

  const keydownListener = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key === KEYS.ESC) close();
    if (key === KEYS.ENTER) create();
  };

  useEffect(() => {
    message.success(
      '点击绘制任意形状，首尾闭合完成绘制，按 ESC 键或鼠标右键取消，按 ENTER 键提前完成',
    );
    document.addEventListener('keydown', keydownListener);
    return () => {
      document.removeEventListener('keydown', keydownListener);
    };
  }, []);

  console.log('🙄', 222)

  return (
    <div
      className={styles['shape-create-canvas']}
      ref={shapeCanvasRef}
      onMouseDown={addPoint}
      onMouseMove={updateMousePosition}
      onContextMenu={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <svg overflow="visible">
        <path
          d={path()}
          stroke="#d14424"
          fill={closed ? 'rgba(226, 83, 77, 0.15)' : 'none'}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default ShapeCreateCanvas;
