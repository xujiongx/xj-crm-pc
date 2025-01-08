import {
  deleteFile,
  fetchFileList,
} from '@/pages/MotionVideo/components/PPTEditor/services';
import { useRequest } from 'ahooks';
import { message } from 'antd';

export const useFileOperate = (type: string) => {
  const {
    loading: listLoading,
    data: fileList,
    refresh: fileListRefresh,
  } = useRequest(async () => {
    const res = await fetchFileList({
      type,
    });
    if (res.code) {
      message.error(res.msg);
    }
    return res.result;
  });

  const { runAsync: deleteFileAsync, loading: deleteFileLoading } = useRequest(
    async (id) => {
      const res = await deleteFile(id);
      if (res.code) {
        message.error({
          content: res.msg,
        });
        return;
      }
      return res;
    },
    {
      manual: true,
    },
  );

  return {
    listLoading,
    fileList,
    fileListRefresh,
    deleteFileAsync,
    deleteFileLoading,
  };
};
