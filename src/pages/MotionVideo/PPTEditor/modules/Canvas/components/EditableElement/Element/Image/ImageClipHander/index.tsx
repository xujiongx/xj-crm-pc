import { KEYS } from '@/pages/MotionVideo/PPTEditor/config/hotkey';
import { OperateResizeHandlers } from '@/pages/MotionVideo/PPTEditor/interface';
import {
  useKeyboardStore,
  useMainStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import { ImageClipedEmitData } from '@/pages/MotionVideo/PPTEditor/types/edit';
import { ImageClipDataRange } from '@/pages/MotionVideo/PPTEditor/types/slides';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.less';

const ImageClipHandler = (props: any) => {
  const { src, clipData, width, height, top, left, rotate, clipPath, onClip } =
    props;

  const [clipWrapperPositionStyle, setClipWrapperPositionStyle] = useState({
    top: '0',
    left: '0',
  });
  const [topImgWrapperPosition, setTopImgWrapperPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [isSettingClipRange, setIsSettingClipRange] = useState(false);

  const [currentRange, setCurrentRange] = useState<ImageClipDataRange | null>(
    null,
  );
  // 获取裁剪区域信息（裁剪区域占原图的宽高比例，处在原图中的位置）
  const getClipDataTransformInfo = () => {
    // const [start, end] = [
    //       [0, 0],
    //       [100, 100],
    //     ];
    const [start, end] = props.clipData
      ? props.clipData.range
      : [
          [0, 0],
          [100, 100],
        ];
    const widthScale = (end[0] - start[0]) / 100;
    const heightScale = (end[1] - start[1]) / 100;
    const left = start[0] / widthScale;
    const top = start[1] / heightScale;

    return { widthScale, heightScale, left, top };
  };

  // 底层图片位置大小（遮罩区域图片）
  const imgPosition = useMemo(() => {
    const { widthScale, heightScale, left, top } = getClipDataTransformInfo();
    return {
      left: -left,
      top: -top,
      width: 100 / widthScale,
      height: 100 / heightScale,
    };
  }, [props.clipData]);

  // 底层图片位置大小样式（遮罩区域图片）
  const bottomImgPositionStyle = useMemo(() => {
    return {
      top: imgPosition.top + '%',
      left: imgPosition.left + '%',
      width: imgPosition.width + '%',
      height: imgPosition.height + '%',
    };
  }, [imgPosition]);

  // 顶层图片容器位置大小样式（裁剪高亮区域）
  const topImgWrapperPositionStyle = useMemo(() => {
    const { top, left, width, height } = topImgWrapperPosition;
    return {
      top: top + '%',
      left: left + '%',
      width: width + '%',
      height: height + '%',
    };
  }, [topImgWrapperPosition]);

  // 顶层图片位置大小样式（裁剪区域图片）
  const topImgPositionStyle = useMemo(() => {
    const bottomWidth = imgPosition.width;
    const bottomHeight = imgPosition.height;

    const { top, left, width, height } = topImgWrapperPosition;

    return {
      left: -left * (100 / width) + '%',
      top: -top * (100 / height) + '%',
      width: (bottomWidth / width) * 100 + '%',
      height: (bottomHeight / height) * 100 + '%',
    };
  }, [imgPosition, topImgWrapperPosition]);

  const canvasScale = useMainStore((state) => state.canvasScale);
  const ctrlOrShiftKeyActive = useKeyboardStore(
    (state) => state.ctrlOrShiftKeyActive,
  )();

  const cornerPoint = [
    OperateResizeHandlers.LEFT_TOP,
    OperateResizeHandlers.RIGHT_TOP,
    OperateResizeHandlers.LEFT_BOTTOM,
    OperateResizeHandlers.RIGHT_BOTTOM,
  ];

  // 计算并更新裁剪区域范围数据
  const updateRange = useCallback(() => {
    const retPosition = {
      left: parseInt(topImgPositionStyle.left),
      top: parseInt(topImgPositionStyle.top),
      width: parseInt(topImgPositionStyle.width),
      height: parseInt(topImgPositionStyle.height),
    };

    const widthScale = 100 / retPosition.width;
    const heightScale = 100 / retPosition.height;

    const start: [number, number] = [
      -retPosition.left * widthScale,
      -retPosition.top * heightScale,
    ];
    const end: [number, number] = [
      widthScale * 100 + start[0],
      heightScale * 100 + start[1],
    ];

    setCurrentRange([start, end]);
  }, [topImgPositionStyle]);

  useEffect(() => {
    if (isSettingClipRange) {
      updateRange();
    }
  }, [isSettingClipRange, updateRange]);

  // 移动裁剪区域
  const moveClipRange = (e: MouseEvent) => {
    setIsSettingClipRange(true);
    let isMouseDown = true;

    const startPageX = e.pageX;
    const startPageY = e.pageY;
    const bottomPosition = imgPosition;
    const originPositopn = { ...topImgWrapperPosition };

    document.onmousemove = (e) => {
      if (!isMouseDown) return;

      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      const _moveX = (currentPageX - startPageX) / canvasScale;
      const _moveY = (currentPageY - startPageY) / canvasScale;

      const _moveL = Math.sqrt(_moveX * _moveX + _moveY * _moveY);
      const _moveLRotate = Math.atan2(_moveY, _moveX);

      const rotate = _moveLRotate - (props.rotate / 180) * Math.PI;

      const moveX = ((_moveL * Math.cos(rotate)) / props.width) * 100;
      const moveY = ((_moveL * Math.sin(rotate)) / props.height) * 100;

      let targetLeft = originPositopn.left + moveX;
      let targetTop = originPositopn.top + moveY;

      if (targetLeft < 0) targetLeft = 0;
      else if (targetLeft + originPositopn.width > bottomPosition.width) {
        targetLeft = bottomPosition.width - originPositopn.width;
      }
      if (targetTop < 0) targetTop = 0;
      else if (targetTop + originPositopn.height > bottomPosition.height) {
        targetTop = bottomPosition.height - originPositopn.height;
      }

      setTopImgWrapperPosition({
        ...topImgWrapperPosition,
        left: targetLeft,
        top: targetTop,
      });
    };

    document.onmouseup = () => {
      isMouseDown = false;
      document.onmousemove = null;
      document.onmouseup = null;
      // updateRange(curTopImgWrapperPosition);
      setTimeout(() => {
        setIsSettingClipRange(false);
      }, 0);
    };
  };

  // 缩放裁剪区域
  const scaleClipRange = (e: MouseEvent, type: OperateResizeHandlers) => {
    setIsSettingClipRange(true);
    let isMouseDown = true;

    const minWidth = (50 / props.width) * 100;
    const minHeight = (50 / props.height) * 100;

    const startPageX = e.pageX;
    const startPageY = e.pageY;
    const bottomPosition = imgPosition;
    const originPositopn = { ...topImgWrapperPosition };

    const aspectRatio =
      topImgWrapperPosition.width / topImgWrapperPosition.height;

    document.onmousemove = (e) => {
      if (!isMouseDown) return;

      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      const _moveX = (currentPageX - startPageX) / canvasScale;
      const _moveY = (currentPageY - startPageY) / canvasScale;

      const _moveL = Math.sqrt(_moveX * _moveX + _moveY * _moveY);
      const _moveLRotate = Math.atan2(_moveY, _moveX);

      const rotate = _moveLRotate - (props.rotate / 180) * Math.PI;

      let moveX = ((_moveL * Math.cos(rotate)) / props.width) * 100;
      let moveY = ((_moveL * Math.sin(rotate)) / props.height) * 100;

      if (ctrlOrShiftKeyActive) {
        if (
          type === OperateResizeHandlers.RIGHT_BOTTOM ||
          type === OperateResizeHandlers.LEFT_TOP
        )
          moveY = moveX / aspectRatio;
        if (
          type === OperateResizeHandlers.LEFT_BOTTOM ||
          type === OperateResizeHandlers.RIGHT_TOP
        )
          moveY = -moveX / aspectRatio;
      }

      let targetLeft, targetTop, targetWidth, targetHeight;

      if (type === OperateResizeHandlers.LEFT_TOP) {
        if (originPositopn.left + moveX < 0) {
          moveX = -originPositopn.left;
        }
        if (originPositopn.top + moveY < 0) {
          moveY = -originPositopn.top;
        }
        if (originPositopn.width - moveX < minWidth) {
          moveX = originPositopn.width - minWidth;
        }
        if (originPositopn.height - moveY < minHeight) {
          moveY = originPositopn.height - minHeight;
        }
        targetWidth = originPositopn.width - moveX;
        targetHeight = originPositopn.height - moveY;
        targetLeft = originPositopn.left + moveX;
        targetTop = originPositopn.top + moveY;
      } else if (type === OperateResizeHandlers.RIGHT_TOP) {
        if (
          originPositopn.left + originPositopn.width + moveX >
          bottomPosition.width
        ) {
          moveX =
            bottomPosition.width - (originPositopn.left + originPositopn.width);
        }
        if (originPositopn.top + moveY < 0) {
          moveY = -originPositopn.top;
        }
        if (originPositopn.width + moveX < minWidth) {
          moveX = minWidth - originPositopn.width;
        }
        if (originPositopn.height - moveY < minHeight) {
          moveY = originPositopn.height - minHeight;
        }
        targetWidth = originPositopn.width + moveX;
        targetHeight = originPositopn.height - moveY;
        targetLeft = originPositopn.left;
        targetTop = originPositopn.top + moveY;
      } else if (type === OperateResizeHandlers.LEFT_BOTTOM) {
        if (originPositopn.left + moveX < 0) {
          moveX = -originPositopn.left;
        }
        if (
          originPositopn.top + originPositopn.height + moveY >
          bottomPosition.height
        ) {
          moveY =
            bottomPosition.height -
            (originPositopn.top + originPositopn.height);
        }
        if (originPositopn.width - moveX < minWidth) {
          moveX = originPositopn.width - minWidth;
        }
        if (originPositopn.height + moveY < minHeight) {
          moveY = minHeight - originPositopn.height;
        }
        targetWidth = originPositopn.width - moveX;
        targetHeight = originPositopn.height + moveY;
        targetLeft = originPositopn.left + moveX;
        targetTop = originPositopn.top;
      } else if (type === OperateResizeHandlers.RIGHT_BOTTOM) {
        if (
          originPositopn.left + originPositopn.width + moveX >
          bottomPosition.width
        ) {
          moveX =
            bottomPosition.width - (originPositopn.left + originPositopn.width);
        }
        if (
          originPositopn.top + originPositopn.height + moveY >
          bottomPosition.height
        ) {
          moveY =
            bottomPosition.height -
            (originPositopn.top + originPositopn.height);
        }
        if (originPositopn.width + moveX < minWidth) {
          moveX = minWidth - originPositopn.width;
        }
        if (originPositopn.height + moveY < minHeight) {
          moveY = minHeight - originPositopn.height;
        }
        targetWidth = originPositopn.width + moveX;
        targetHeight = originPositopn.height + moveY;
        targetLeft = originPositopn.left;
        targetTop = originPositopn.top;
      } else if (type === OperateResizeHandlers.TOP) {
        if (originPositopn.top + moveY < 0) {
          moveY = -originPositopn.top;
        }
        if (originPositopn.height - moveY < minHeight) {
          moveY = originPositopn.height - minHeight;
        }
        targetWidth = originPositopn.width;
        targetHeight = originPositopn.height - moveY;
        targetLeft = originPositopn.left;
        targetTop = originPositopn.top + moveY;
      } else if (type === OperateResizeHandlers.BOTTOM) {
        if (
          originPositopn.top + originPositopn.height + moveY >
          bottomPosition.height
        ) {
          moveY =
            bottomPosition.height -
            (originPositopn.top + originPositopn.height);
        }
        if (originPositopn.height + moveY < minHeight) {
          moveY = minHeight - originPositopn.height;
        }
        targetWidth = originPositopn.width;
        targetHeight = originPositopn.height + moveY;
        targetLeft = originPositopn.left;
        targetTop = originPositopn.top;
      } else if (type === OperateResizeHandlers.LEFT) {
        if (originPositopn.left + moveX < 0) {
          moveX = -originPositopn.left;
        }
        if (originPositopn.width - moveX < minWidth) {
          moveX = originPositopn.width - minWidth;
        }
        targetWidth = originPositopn.width - moveX;
        targetHeight = originPositopn.height;
        targetLeft = originPositopn.left + moveX;
        targetTop = originPositopn.top;
      } else {
        if (
          originPositopn.left + originPositopn.width + moveX >
          bottomPosition.width
        ) {
          moveX =
            bottomPosition.width - (originPositopn.left + originPositopn.width);
        }
        if (originPositopn.width + moveX < minWidth) {
          moveX = minWidth - originPositopn.width;
        }
        targetHeight = originPositopn.height;
        targetWidth = originPositopn.width + moveX;
        targetLeft = originPositopn.left;
        targetTop = originPositopn.top;
      }

      setTopImgWrapperPosition({
        left: targetLeft,
        top: targetTop,
        width: targetWidth,
        height: targetHeight,
      });
    };

    document.onmouseup = () => {
      isMouseDown = false;
      document.onmousemove = null;
      document.onmouseup = null;

      // updateRange(curTopImgWrapperPosition);

      setTimeout(() => setIsSettingClipRange(false), 0);
    };
  };

  // 初始化裁剪位置信息
  const initClipPosition = () => {
    const { left, top } = getClipDataTransformInfo();
    setTopImgWrapperPosition({
      left: left,
      top: top,
      width: 100,
      height: 100,
    });

    setClipWrapperPositionStyle({
      top: -top + '%',
      left: -left + '%',
    });
  };

  // 执行裁剪：计算裁剪后的图片位置大小和裁剪信息，并将数据同步出去
  const handleClip = () => {
    if (isSettingClipRange) return;

    if (!currentRange) {
      onClip(null);
      return;
    }

    const { left, top } = getClipDataTransformInfo();

    const position = {
      left: ((topImgWrapperPosition.left - left) / 100) * props.width,
      top: ((topImgWrapperPosition.top - top) / 100) * props.height,
      width: ((topImgWrapperPosition.width - 100) / 100) * props.width,
      height: ((topImgWrapperPosition.height - 100) / 100) * props.height,
    };

    const clipedEmitData: ImageClipedEmitData = {
      range: currentRange,
      position,
    };
    onClip(clipedEmitData);
  };

  const rotateClassName = useMemo(() => {
    const prefix = 'rotate-';
    const rotate = props.rotate;
    if (rotate > -22.5 && rotate <= 22.5) return prefix + 0;
    else if (rotate > 22.5 && rotate <= 67.5) return prefix + 45;
    else if (rotate > 67.5 && rotate <= 112.5) return prefix + 90;
    else if (rotate > 112.5 && rotate <= 157.5) return prefix + 135;
    else if (rotate > 157.5 || rotate <= -157.5) return prefix + 0;
    else if (rotate > -157.5 && rotate <= -112.5) return prefix + 45;
    else if (rotate > -112.5 && rotate <= -67.5) return prefix + 90;
    else if (rotate > -67.5 && rotate <= -22.5) return prefix + 135;
    return prefix + 0;
  }, [props.rotate]);

  // 快捷键监听：回车确认裁剪
  const keyboardListener = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key === KEYS.ENTER) handleClip();
  };

  useEffect(() => {
    document.addEventListener('keydown', keyboardListener);
  }, [currentRange, isSettingClipRange, topImgWrapperPosition]);

  useEffect(() => {
    initClipPosition();
  }, []);

  useEffect(() => {
    return () => {
      document.removeEventListener('keydown', keyboardListener);
    };
  }, []);

  return (
    <div>
      <div
        className={styles['image-clip-handler']}
        style={{
          ...clipWrapperPositionStyle,
          height: height,
        }}
      >
        <img
          className={styles['bottom-img']}
          src={src}
          draggable={false}
          alt=""
          style={bottomImgPositionStyle}
        />
        <div
          className={styles['top-image-content']}
          style={{
            ...topImgWrapperPositionStyle,
            clipPath,
          }}
        >
          <img
            className={styles['top-img']}
            src={src}
            draggable={false}
            alt=""
            style={topImgPositionStyle}
          />
        </div>

        <div
          className={styles['operate']}
          style={topImgWrapperPositionStyle}
          // @mousedown.stop="$event => moveClipRange($event)"
          onMouseDown={(e) => {
            e.stopPropagation();
            moveClipRange(e);
          }}
        >
          {cornerPoint.map((point) => (
            <div
              key={point}
              className={clsx({
                [styles['clip-point']]: true,
                [styles[point]]: true,
                [rotateClassName]: true,
              })}
              onMouseDown={(e) => {
                e.stopPropagation();
                scaleClipRange(e, point);
              }}
              // @mousedown.stop="$event => scaleClipRange($event, point)"
            >
              <svg width="16" height="16" fill="#fff" stroke="#333">
                <path
                  strokeWidth="0.3"
                  shapeRendering="crispEdges"
                  d="M 16 0 L 0 0 L 0 16 L 4 16 L 4 4 L 16 4 L 16 0 Z"
                ></path>
              </svg>
            </div>
          ))}

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ImageClipHandler;
