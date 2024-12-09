import { ImageElementFilterKeys, ImageElementFilters } from "@/pages/MotionVideo/PPTEditor/types/slides"

// 将滤镜配置转为css
export const filters2Style = (filters: ImageElementFilters) => {
  let filter = '';
  const keys = Object.keys(filters) as ImageElementFilterKeys[];
  for (const key of keys) {
    filter += `${key}(${filters[key]}) `;
  }
  return filter;
};
