import {
  cancelRecordingVideo,
  copyVideo,
  deleteVideo,
  retryRecordingVideo,
  saveVideo,
  updateVideo,
} from '@/pages/MotionVideo/services';
import { useRequest } from 'ahooks';
import { message } from 'antd';
/**
 * 创建 更新 视频信息
 * @returns
 */
export const useSaveOrUpdateVideo = () => {
  const { runAsync: saveVideoAsync, loading: saveVideoLoading } = useRequest(
    async (params) => {
      const res = await saveVideo(params);
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
  const { runAsync: updateVideoAsync, loading: updateVideoLoading } =
    useRequest(
      async (params) => {
        const res = await updateVideo(params);
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
    saveVideoAsync,
    saveVideoLoading,
    updateVideoAsync,
    updateVideoLoading,
  };
};

/**
 * 视频相关操作
 * 删除
 * 复制
 * 取消合成
 * 合成重试
 * @returns
 */
export const useOperateVideo = () => {
  const { runAsync: deleteVideoAsync, loading: deleteVideoLoading } =
    useRequest(
      async (id) => {
        const res = await deleteVideo(id);

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
  const { runAsync: copyVideoAsync, loading: copyVideoLoading } = useRequest(
    async (id) => {
      const res = await copyVideo(id);

      if (res?.code) {
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

  const {
    runAsync: retryRecordingVideoAsync,
    loading: retryRecordingVideoLoading,
  } = useRequest(
    async (data) => {
      const res = await retryRecordingVideo(data);

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
  const {
    runAsync: cancelRecordingVideoAsync,
    loading: cancelRecordingVideoLoading,
  } = useRequest(
    async (data) => {
      const res = await cancelRecordingVideo(data);

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
    deleteVideoAsync,
    deleteVideoLoading,
    copyVideoAsync,
    copyVideoLoading,
    retryRecordingVideoAsync,
    retryRecordingVideoLoading,
    cancelRecordingVideoAsync,
    cancelRecordingVideoLoading,
  };
};
