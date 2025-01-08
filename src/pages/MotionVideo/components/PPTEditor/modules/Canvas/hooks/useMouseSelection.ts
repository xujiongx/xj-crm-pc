import { getElementRange } from '@/pages/MotionVideo/utils/element';
import React, { useRef, useState } from 'react';
import { useMainStore } from '../../../store';

const useMouseSelection = (
  elementList: any[],
  viewportRef: React.RefObject<HTMLElement>,
) => {
  const canvasScale = useMainStore((store) => store.canvasScale);
  const setActiveElementIdList = useMainStore(
    (store) => store.setActiveElementIds,
  );
  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  // 使用 useRef 存储状态
  const mouseSelectionVisibleRef = useRef(false);
  const mouseSelectionQuadrantRef = useRef(1);
  const mouseSelectionRef = useRef({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // 使用 useState 存储状态副本以触发重新渲染
  const [mouseSelectionVisible, setMouseSelectionVisible] = useState(false);
  const [mouseSelectionQuadrant, setMouseSelectionQuadrant] = useState(1);
  const [mouseSelection, setMouseSelection] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // 更新鼠标框选范围
  const updateMouseSelection = (e) => {
    if (!viewportRef.current) return;

    let isMouseDown = true;
    const viewportRect = viewportRef.current.getBoundingClientRect();

    const minSelectionRange = 5;

    const startPageX = e.pageX;
    const startPageY = e.pageY;

    const left = (startPageX - viewportRect.x) / canvasScale;
    const top = (startPageY - viewportRect.y) / canvasScale;

    // 确定框选的起始位置和其他默认值初始化
    mouseSelectionRef.current = {
      top: top,
      left: left,
      width: 0,
      height: 0,
    };
    mouseSelectionVisibleRef.current = false;
    mouseSelectionQuadrantRef.current = 4;
    // 同时更新 useState 的状态
    setMouseSelection({
      top: top,
      left: left,
      width: 0,
      height: 0,
    });
    setMouseSelectionVisible(false);
    setMouseSelectionQuadrant(4);

    const handleMouseMove = (e) => {
      if (!isMouseDown) return;

      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      const offsetWidth = (currentPageX - startPageX) / canvasScale;
      const offsetHeight = (currentPageY - startPageY) / canvasScale;

      const width = Math.abs(offsetWidth);
      const height = Math.abs(offsetHeight);

      if (width < minSelectionRange || height < minSelectionRange) return;

      // 计算鼠标框选（移动）的方向
      // 按四个象限的位置区分，如右下角为第四象限
      let quadrant = 0;
      if (offsetWidth > 0 && offsetHeight > 0) quadrant = 4;
      else if (offsetWidth < 0 && offsetHeight < 0) quadrant = 2;
      else if (offsetWidth > 0 && offsetHeight < 0) quadrant = 1;
      else if (offsetWidth < 0 && offsetHeight > 0) quadrant = 3;

      // 更新框选范围
      mouseSelectionRef.current = {
        ...mouseSelectionRef.current,
        width: width,
        height: height,
      };
      mouseSelectionVisibleRef.current = true;
      mouseSelectionQuadrantRef.current = quadrant;
      // 同时更新 useState 的状态
      setMouseSelection({
        ...mouseSelectionRef.current,
        width: width,
        height: height,
      });
      setMouseSelectionVisible(true);
      setMouseSelectionQuadrant(quadrant);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      isMouseDown = false;

      // 计算画布中的元素是否处在鼠标选择范围中，处在范围中的元素设置为被选中状态
      let inRangeElementList: any[] = [];
      for (let i = 0; i < elementList.length; i++) {
        const element = elementList[i];
        const mouseSelectionLeft = mouseSelectionRef.current.left;
        const mouseSelectionTop = mouseSelectionRef.current.top;
        const mouseSelectionWidth = mouseSelectionRef.current.width;
        const mouseSelectionHeight = mouseSelectionRef.current.height;

        const { minX, maxX, minY, maxY } = getElementRange(element);

        // 计算元素是否处在框选范围内时，四个框选方向的计算方式有差异
        let isInclude = false;
        if (mouseSelectionQuadrantRef.current === 4) {
          isInclude =
            minX > mouseSelectionLeft &&
            maxX < mouseSelectionLeft + mouseSelectionWidth &&
            minY > mouseSelectionTop &&
            maxY < mouseSelectionTop + mouseSelectionHeight;
        } else if (mouseSelectionQuadrantRef.current === 2) {
          isInclude =
            minX > mouseSelectionLeft - mouseSelectionWidth &&
            maxX <
              mouseSelectionLeft - mouseSelectionWidth + mouseSelectionWidth &&
            minY > mouseSelectionTop - mouseSelectionHeight &&
            maxY <
              mouseSelectionTop - mouseSelectionHeight + mouseSelectionHeight;
        } else if (mouseSelectionQuadrantRef.current === 1) {
          isInclude =
            minX > mouseSelectionLeft &&
            maxX < mouseSelectionLeft + mouseSelectionWidth &&
            minY > mouseSelectionTop - mouseSelectionHeight &&
            maxY <
              mouseSelectionTop - mouseSelectionHeight + mouseSelectionHeight;
        } else if (mouseSelectionQuadrantRef.current === 3) {
          isInclude =
            minX > mouseSelectionLeft - mouseSelectionWidth &&
            maxX <
              mouseSelectionLeft - mouseSelectionWidth + mouseSelectionWidth &&
            minY > mouseSelectionTop &&
            maxY < mouseSelectionTop + mouseSelectionHeight;
        }

        // 被锁定或被隐藏的元素即使在范围内，也不需要设置为选中状态
        if (
          isInclude &&
          !element.lock &&
          !hiddenElementIdList.includes(element.id)
        )
          inRangeElementList.push(element);
      }

      // 如果范围内有组合元素的成员，需要该组全部成员都处在范围内，才会被设置为选中状态
      inRangeElementList = inRangeElementList.filter((inRangeElement) => {
        if (inRangeElement.groupId) {
          const inRangeElementIdList = inRangeElementList.map(
            (inRangeElement) => inRangeElement.id,
          );
          const groupElementList = elementList.filter(
            (element) => element.groupId === inRangeElement.groupId,
          );
          return groupElementList.every((groupElement) =>
            inRangeElementIdList.includes(groupElement.id),
          );
        }
        return true;
      });
      const inRangeElementIdList = inRangeElementList.map(
        (inRangeElement) => inRangeElement.id,
      );

      setActiveElementIdList(inRangeElementIdList);

      // 更新 useState 的状态
      setMouseSelectionVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    mouseSelection,
    mouseSelectionVisible,
    mouseSelectionQuadrant,
    updateMouseSelection,
  };
};

export default useMouseSelection;
