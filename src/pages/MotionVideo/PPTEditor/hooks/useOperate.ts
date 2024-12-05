import { OperateBorderLines, OperateResizeHandlers } from '../interface';

const useOperate = (width: number, height: number) => {
  return {
    borderLines: [
      { type: OperateBorderLines.T, style: { width: width + 'px' } },
      {
        type: OperateBorderLines.B,
        style: { top: height + 'px', width: width + 'px' },
      },
      { type: OperateBorderLines.L, style: { height: height + 'px' } },
      {
        type: OperateBorderLines.R,
        style: { left: width + 'px', height: height + 'px' },
      },
    ],
    resizeHandlers: [
      { direction: OperateResizeHandlers.LEFT_TOP, style: {} },
      {
        direction: OperateResizeHandlers.TOP,
        style: { left: width / 2 },
      },
      {
        direction: OperateResizeHandlers.RIGHT_TOP,
        style: { left: width },
      },
      {
        direction: OperateResizeHandlers.LEFT,
        style: { top: height / 2 },
      },
      {
        direction: OperateResizeHandlers.RIGHT,
        style: { left: width, top: height / 2 },
      },
      {
        direction: OperateResizeHandlers.LEFT_BOTTOM,
        style: { top: height },
      },
      {
        direction: OperateResizeHandlers.BOTTOM,
        style: { left: width / 2, top: height },
      },
      {
        direction: OperateResizeHandlers.RIGHT_BOTTOM,
        style: { left: width, top: height },
      },
    ],
    textElementResizeHandlers: [
      { direction: OperateResizeHandlers.LEFT, style: { top: height / 2 } },
      {
        direction: OperateResizeHandlers.RIGHT,
        style: { left: width, top: height / 2 },
      },
    ],
    verticalTextElementResizeHandlers: [
      { direction: OperateResizeHandlers.TOP, style: { left: width / 2 } },
      {
        direction: OperateResizeHandlers.BOTTOM,
        style: { left: width / 2, top: height },
      },
    ],
  };
};

export default useOperate;
