import { getUrlParams } from '@/utils';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { fetchVideoDetail } from '../../services'

export const usePreview = () => {
  const { id } = getUrlParams<{
    id: string;
  }>();

  const [config, setConfig] = useState<{
    data: any;
    dimensionRatio: string;
    toVideoStartPage: number;
    toVideoEndPage: number;
  }>();

  const { data } = useRequest(
    async () => {
      const res = await fetchVideoDetail(id);
      if (res?.code === 0) {
        return res.result;
      }
    },
    {
      ready: !!id,
    },
  );

  useEffect(() => {
    if (!id || !data) {
      return;
    }
    const { jsonData, dimensionRatio, toVideoStartPage, toVideoEndPage } = data;
    const fetchData = JSON.parse(jsonData || '{}');
    const PPTData = {
      slides: fetchData.pages,
      hiddenElementIdList: fetchData.hiddenElementIdList,
    };
    setConfig({
      data: PPTData,
      dimensionRatio,
      toVideoStartPage: toVideoStartPage || 1,
      toVideoEndPage: toVideoEndPage || 0,
    });
  }, [id, data]);

  return { ...config };
};
