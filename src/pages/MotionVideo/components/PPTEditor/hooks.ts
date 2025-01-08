import { getUrlParams } from '@/utils';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useSaveOrUpdateVideo } from '../../hooks/useVideoServices';
import { recordingVideo } from './services';
import { useMainStore, useSlidesStore } from './store';

export const useRecordVideo = () => {
  const { runAsync: recordingVideoAsync, loading: recordingVideoLoading } =
    useRequest(
      async (data) => {
        const res = await recordingVideo(data);

        if (res.code) {
          message.error({
            content: res.msg,
          });
        }
        return res;
      },
      {
        manual: true,
      },
    );

  return {
    recordingVideoAsync,
    recordingVideoLoading,
  };
};

export const useSaveCurVideo = () => {
  const { id } = getUrlParams<{
    id: string;
  }>();
  const slides = useSlidesStore((state) => state.slides);
  const theme = useSlidesStore((state) => state.theme);
  const hiddenElementIdList = useMainStore(
    (state) => state.hiddenElementIdList,
  );

  const { updateVideoAsync, updateVideoLoading } = useSaveOrUpdateVideo();

  const setIsEditorHsaChange = useMainStore(
    (state) => state.setIsEditorHsaChange,
  );
  const handleSaveCurVideo = async () => {
    const PPTEditorData = {
      pages: slides,
      hiddenElementIdList,
      theme,
    };
    setIsEditorHsaChange(false);

    return await updateVideoAsync({
      id,
      jsonData: JSON.stringify(PPTEditorData),
    });
  };

  return {
    handleSaveCurVideo,
    updateVideoLoading,
    localPPTData: {
      pages: slides,
      hiddenElementIdList,
    },
  };
};
