import { useEffect, useRef, useState } from 'react';
import useMainStore from '../store/main';

export const VIEWPORT_SIZE = 1000;

const useViewportSize = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [viewport, setViewport] = useState({
    top: 0,
    left: 0,
  });
  const oldCanvasPercentageRef = useRef(0);

  const canvasPercentage = useMainStore((state) => state.canvasPercentage);
  const canvasDragged = useMainStore((state) => state.canvasDragged);
  const viewportRatio = useMainStore((state) => state.viewportRatio);

  // 可视区域比例变化时，更新可视区域的位置
  useEffect(() => {
    if (oldCanvasPercentageRef.current) {
      setViewportPosition(canvasPercentage, oldCanvasPercentageRef.current);
      oldCanvasPercentageRef.current = canvasPercentage;
    }
  }, [canvasRef, canvasPercentage]);

  // 可视区域缩放变化时，重置可视区域的位置
  useEffect(() => {
    initViewportPosition();
  }, [canvasRef, viewportRatio]);

  // 画布拖拽状态改变（复原）时，重置可视区域的位置
  useEffect(() => {
    !canvasDragged && initViewportPosition();
  }, [canvasRef, canvasDragged]);

  // 初始化画布可视区域的位置
  const initViewportPosition = () => {
    if (!canvasRef.current) return;
    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;
    oldCanvasPercentageRef.current = canvasPercentage;
    if (canvasHeight / canvasWidth > viewportRatio) {
      // const viewportActualWidth = Math.min(
      //   VIEWPORT_SIZE,
      //   canvasWidth * (canvasPercentage / 100),
      // );
      const viewportActualWidth = canvasWidth * (canvasPercentage / 100);
      useMainStore
        .getState()
        .setCanvasScale(viewportActualWidth / VIEWPORT_SIZE);
      setViewport({
        top: (canvasHeight - viewportActualWidth * viewportRatio) / 2,
        left: (canvasWidth - viewportActualWidth) / 2,
      });
    } else {
      // const viewportActualHeight = Math.min(
      //   VIEWPORT_SIZE * viewportRatio,
      //   canvasHeight * (canvasPercentage / 100),
      // );
      const viewportActualHeight = canvasHeight * (canvasPercentage / 100);
      useMainStore
        .getState()
        .setCanvasScale(viewportActualHeight / (VIEWPORT_SIZE * viewportRatio));
      setViewport({
        top: (canvasHeight - viewportActualHeight) / 2,
        left: (canvasWidth - viewportActualHeight / viewportRatio) / 2,
      });
    }
  };

  // 更新画布可视区域的位置
  const setViewportPosition = (newValue: number, oldValue: number) => {
    if (!canvasRef.current) return;

    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;

    const newViewportActualWidth = canvasWidth * (newValue / 100);
    const oldViewportActualWidth = canvasWidth * (oldValue / 100);
    const newViewportActualHeight = canvasHeight * (newValue / 100);
    const oldViewportActualHeight = canvasHeight * (oldValue / 100);

    if (canvasHeight / canvasWidth > viewportRatio) {
      useMainStore
        .getState()
        .setCanvasScale(newViewportActualWidth / VIEWPORT_SIZE);
    } else {
      useMainStore
        .getState()
        .setCanvasScale(
          newViewportActualHeight / (VIEWPORT_SIZE * viewportRatio),
        );
    }
    setViewport((data) => ({
      top: data.top - (newViewportActualHeight - oldViewportActualHeight) / 2,
      left: data.left - (newViewportActualWidth - oldViewportActualWidth) / 2,
    }));
  };

  // 监听画布尺寸发生变化时，重置可视区域的位置
  const resizeObserver = new ResizeObserver(initViewportPosition);

  useEffect(() => {
    canvasRef.current && resizeObserver.observe(canvasRef.current);
    return () => {
      canvasRef.current && resizeObserver.unobserve(canvasRef.current);
    };
  }, [canvasRef]);

  // 拖拽画布
  const dragViewport = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let isMouseDown = true;
    const startPageX = e.pageX;
    const startPageY = e.pageY;
    const originLeft = viewport.left;
    const originTop = viewport.top;
    document.onmousemove = (e) => {
      if (!isMouseDown) return;
      const currentPageX = e.pageX;
      const currentPageY = e.pageY;
      setViewport({
        top: originTop + (currentPageY - startPageY),
        left: originLeft + (currentPageX - startPageX),
      });
    };
    document.onmouseup = () => {
      isMouseDown = false;
      document.onmousemove = null;
      document.onmouseup = null;
      useMainStore.getState().setCanvasDragged(true);
    };
  };

  return {
    dragViewport,
    viewportStyles: {
      width: VIEWPORT_SIZE,
      height: VIEWPORT_SIZE * viewportRatio,
      ...viewport,
    },
  };
};

export default useViewportSize;
