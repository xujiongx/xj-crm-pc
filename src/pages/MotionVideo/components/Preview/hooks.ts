import { getUrlParams } from '@/utils';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import useImportSlides from '../PPTEditor/hooks/useImportSlides';
import { fetchVideoDetail } from './services';

export const usePreview = () => {
  const { id, dimensionRatio } = getUrlParams<{
    id: string;
    dimensionRatio: string;
  }>();
  const [PPTData, setPPTData] = useState<any>({});
  const { importSlidesFromData } = useImportSlides();

  const { data } = useRequest(
    async () => {
      // 获取技能组配置
      const res = await fetchVideoDetail(id);
      if (res?.code === 0) {
        return res.result;
      }
    },
    { cacheKey: 'fetchVideoDetail' },
  );

  const formatData = () => {
    if (!data.toVideoFlag) {
      const slides = JSON.parse(data.jsonData).pages;
      const newSlides = importSlidesFromData(slides);
      setPPTData({
        slides: newSlides,
      });
    }
  };

  useEffect(() => {
    if (!data) return;
    formatData();
  }, [data]);
  return { PPTData };
};
