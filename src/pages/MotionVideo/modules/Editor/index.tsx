import { getUrlParams } from '@/utils';
import { useRequest } from 'ahooks';
import { message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import PPTEditor from '../../components/PPTEditor';
import { fetchVideoDetail } from '../../services';
import { importSlidesFromData } from './format';

const Editor = () => {
  const { id, dimensionRatio } = getUrlParams<{
    id: string;
    dimensionRatio: string;
  }>();

  const [PPTData, setPPTData] = useState({});

  const { data, loading } = useRequest(
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

  const formatData = () => {
    if (!data.firstParse) {
      let jsonData = {
        slides: [],
        hiddenElementIdList: [],
        theme: {},
      };
      try {
        const fetchData = JSON.parse(data.jsonData || '{}');
        jsonData = {
          slides: fetchData.pages,
          theme: fetchData.theme,
          hiddenElementIdList: fetchData.hiddenElementIdList,
        };
      } catch (e) {
        message.error('解析数据失败');
      }
      return jsonData;
    }
    let slides = [];
    try {
      slides = JSON.parse(data.jsonData || '{}')?.pages || [];
    } catch (e) {
      message.error('解析数据失败');
    }
    const newSlides = importSlidesFromData(slides);
    return {
      slides: newSlides,
      hiddenElementIdList: [],
      theme: {},
    };
  };

  useEffect(() => {
    if (!id) {
      setPPTData({ slides: [] });
      return;
    }
    if (!data) return;
    const { slides = [], hiddenElementIdList = [], theme } = formatData();
    setPPTData({
      slides,
      hiddenElementIdList,
      theme,
    });
  }, [id, data]);

  useEffect(() => {
    return () => {
      setPPTData({});
    };
  }, []);

  return (
    <Spin spinning={loading}>
      <PPTEditor
        PPTEditorData={PPTData}
        dimensionRatio={dimensionRatio}
        videoData={data}
      />
    </Spin>
  );
};

export default Editor;
