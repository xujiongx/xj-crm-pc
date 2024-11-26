import { AlignLine, PPTElement, SlideItem } from '../interface';
import { nanoid } from 'nanoid'

interface RotatedElementData {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
}


interface IdMap {
  [id: string]: string
}


/**
 * 将一组对齐吸附线进行去重：同位置的的多条对齐吸附线仅留下一条，取该位置所有对齐吸附线的最大值和最小值为新的范围
 * @param lines 一组对齐吸附线信息
 */
export const uniqAlignLines = (lines: AlignLine[]) => {
  const uniqLines: AlignLine[] = [];
  lines.forEach((line) => {
    const index = uniqLines.findIndex((_line) => _line.value === line.value);
    if (index === -1) uniqLines.push(line);
    else {
      const uniqLine = uniqLines[index];
      const rangeMin = Math.min(uniqLine.range[0], line.range[0]);
      const rangeMax = Math.max(uniqLine.range[1], line.range[1]);
      const range: [number, number] = [rangeMin, rangeMax];
      const _line = { value: line.value, range };
      uniqLines[index] = _line;
    }
  });
  return uniqLines;
};

/**
 * 计算元素在画布中的矩形范围旋转后的新位置范围
 * @param element 元素的位置大小和旋转角度信息
 */
export const getRectRotatedRange = (element: RotatedElementData) => {
  const { left, top, width, height, rotate = 0 } = element;

  const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
  const auxiliaryAngle = (Math.atan(height / width) * 180) / Math.PI;

  const tlbraRadian = ((180 - rotate - auxiliaryAngle) * Math.PI) / 180;
  const trblaRadian = ((auxiliaryAngle - rotate) * Math.PI) / 180;

  const middleLeft = left + width / 2;
  const middleTop = top + height / 2;

  const xAxis = [
    middleLeft + radius * Math.cos(tlbraRadian),
    middleLeft + radius * Math.cos(trblaRadian),
    middleLeft - radius * Math.cos(tlbraRadian),
    middleLeft - radius * Math.cos(trblaRadian),
  ];
  const yAxis = [
    middleTop - radius * Math.sin(tlbraRadian),
    middleTop - radius * Math.sin(trblaRadian),
    middleTop + radius * Math.sin(tlbraRadian),
    middleTop + radius * Math.sin(trblaRadian),
  ];

  return {
    xRange: [Math.min(...xAxis), Math.max(...xAxis)],
    yRange: [Math.min(...yAxis), Math.max(...yAxis)],
  };
};


/**
 * 计算元素在画布中的位置范围
 * @param element 元素信息
 */
export const getElementRange = (element: PPTElement) => {
  let minX, maxX, minY, maxY
  if ('rotate' in element && element.rotate) {
    const { left, top, width, height, rotate } = element
    const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
    minX = xRange[0]
    maxX = xRange[1]
    minY = yRange[0]
    maxY = yRange[1]
  }
  else {
    minX = element.left
    maxX = element.left + element.width
    minY = element.top
    maxY = element.top + element.height
  }
  return { minX, maxX, minY, maxY }
}


/**
   * 以元素列表为基础，为每一个元素生成新的ID，并关联到旧ID形成一个字典
   * 主要用于复制元素时，维持数据中各处元素ID原有的关系
   * 例如：原本两个组合的元素拥有相同的groupId，复制后依然会拥有另一个相同的groupId
   * @param elements 元素列表数据
   */
export const createElementIdMap = (elements: PPTElement[]) => {
  const groupIdMap: IdMap = {}
  const elIdMap: IdMap = {}
  for (const element of elements) {
    const groupId = element.groupId
    if (groupId && !groupIdMap[groupId]) {
      groupIdMap[groupId] = nanoid(10)
    }
    elIdMap[element.id] = nanoid(10)
  }
  return {
    groupIdMap,
    elIdMap,
  }
}


/**
 * 以页面列表为基础，为每一个页面生成新的ID，并关联到旧ID形成一个字典
 * 主要用于页面元素时，维持数据中各处页面ID原有的关系
 * @param slides 页面列表
 */
export const createSlideIdMap = (slides: SlideItem[]) => {
  const slideIdMap: IdMap = {}
  for (const slide of slides) {
    slideIdMap[slide.id] = nanoid(10)
  }
  return slideIdMap
}
