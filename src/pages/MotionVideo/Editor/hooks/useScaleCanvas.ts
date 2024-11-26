import useMainStore from '../store/main';

const useScaleCanvas = () => {
  const canvasPercentage = useMainStore((store) => store.canvasPercentage);
  const canvasScale = useMainStore((store) => store.canvasScale);
  const canvasDragged = useMainStore((store) => store.canvasDragged);

  console.log(canvasPercentage, canvasScale);

  /**
   * 缩放画布百分比
   * @param command 缩放命令：放大、缩小
   */
  const scale = (command: '+' | '-') => {
    let percentage = canvasPercentage;
    const step = 5;
    const max = 200;
    const min = 30;
    if (command === '+' && percentage <= max) percentage += step;
    if (command === '-' && percentage >= min) percentage -= step;
    useMainStore.getState().setCanvasPercentage(percentage);
  };

  const reset = () => {
    useMainStore.getState().setCanvasPercentage(90);
    if (canvasDragged) useMainStore.getState().setCanvasDragged(false);
  };

  return {
    reset,
    scale,
  };
};

export default useScaleCanvas;
