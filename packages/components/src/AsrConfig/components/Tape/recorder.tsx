import { useUploadQueue } from '@aicc/hooks';
import { useSetState } from 'ahooks';
import { Button, Space, Tooltip, message } from 'antd';
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
} from 'antd/es/upload/interface';
import { FC, Fragment, ReactNode } from 'react';
import { RecorderAudio } from '../../../Recorder';
import Uploader from '../../../Uploader';
import { prefix } from '../../index';
import '../../index.less';
import { fileType } from '../Upload';

interface RecordProps {
  src?: string;
  action: string;
  fileName: string;
  sampleRate?: 8000 | 16000;
  limitSize?: number;
  chunkSize?: number;
  disabled: boolean;
  IconFont: FC<any>;
  params: Record<string, any>;
  extraAction?: () => ReactNode;
  onStartRecord: () => void;
  onEndRecord: () => void;
  apiConvert: (data: FormData) => Promise<any>;
  apiUploadMinio?: (data: any) => Promise<any>;
  refresh: () => void;
  refreshAllUpload?: () => void;
}

const Record: FC<RecordProps> = ({
  action,
  fileName,
  sampleRate = 8000,
  limitSize = 5,
  chunkSize,
  params,
  disabled,
  src,
  IconFont,
  extraAction,
  onStartRecord,
  onEndRecord,
  apiConvert,
  apiUploadMinio,
  refresh,
  refreshAllUpload,
}) => {
  const { initUpload } = useUploadQueue({
    chunkSize: 10,
    limitSize: chunkSize,
  });

  const [state, setState] = useSetState({
    uploading: false,
    recording: false,
    ttsLoading: false,
    sync: false,
  });

  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    const { file } = info;
    switch (info.file.status) {
      case 'done':
        if (file?.response.code === 0) {
          refresh();
          refreshAllUpload?.();
          message.open({
            type: 'success',
            content: file?.response.msg || '上传成功',
          });
        } else {
          message.open({
            type: 'error',
            content: file?.response?.msg || '上传失败',
          });
        }
        setState({ uploading: false });
        break;
      case 'error':
        message.open({
          type: 'error',
          content: file?.response?.msg || '上传失败',
        });
        setState({ uploading: false });
        break;
      case 'uploading':
        setState({ uploading: true });
        break;
      default:
        break;
    }
  };

  const uploadMinio = async (file: RcFile[]) => {
    if (!apiUploadMinio) return;
    try {
      setState({ uploading: true });
      const fileInfo = await initUpload(file);
      if (!fileInfo?.length) return setState({ uploading: false });

      const res = await apiUploadMinio?.({
        ...params,
        fileUrl: fileInfo?.[0]?.src,
      });
      setState({ uploading: false });
      if (res?.code !== 0) return;
      refresh();
      refreshAllUpload?.();
    } catch (error) {
      setState({ uploading: false });
      console.log(error, '真人录音上传minio失败');
    }
  };

  const onBeforeUpload = async (file: RcFile) => {
    if (!fileType.regex.test(file.name)) {
      message.error(`文件只支持格式：${fileType.tooltip}`);
      return false;
    }
    if (file?.size / 1024 / 1024 > limitSize) {
      message.error(`文件不能超过${limitSize}M`);
      return false;
    }
    if (file?.size / 1024 / 1024 > (chunkSize || Infinity)) {
      /** 大文件，分片上传 */
      uploadMinio([file]);
      return false;
    }
  };

  const onRecord = async (blob: Blob) => {
    if (blob?.size / 1024 / 1024 > limitSize)
      return message.error(`录音不能超过${limitSize}M，请重新录制`);

    const formData = new FormData();
    formData.append(
      'file',
      blob,
      fileType.regex.test(fileName) ? fileName : `${fileName}.wav`,
    );
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await apiConvert(formData);
  };

  return (
    <Fragment>
      <Space align="center">
        {src ? extraAction?.() : null}
        <Uploader
          action={action}
          beforeUpload={onBeforeUpload}
          acceptFormat={fileType.accept.split(',').map((item) => item.slice(1))}
          disabled={state.uploading || state.recording || disabled}
          showUploadList={false}
          data={params}
          onChange={handleUpload}
        >
          <Tooltip title="上传录音">
            <Button
              className={`${prefix}-tape-upload`}
              loading={state.uploading}
              type="text"
              icon={
                <IconFont
                  type="icon-upload"
                  style={{
                    cursor: state.recording || disabled ? 'not-allowed' : '',
                  }}
                />
              }
            />
          </Tooltip>
        </Uploader>
        <RecorderAudio
          sampleRate={sampleRate}
          disabled={disabled}
          src={src}
          speedIcon={<IconFont type="icon-speed" />}
          recordIcon={<IconFont type="icon-scp-microphone" />}
          onStartRecord={() => {
            setState({ recording: true });
            onStartRecord?.();
          }}
          onEndRecord={() => {
            setState({ recording: false });
            onEndRecord?.();
          }}
          apiConvert={onRecord}
          IconFont={IconFont}
        />
      </Space>
    </Fragment>
  );
};

export default Record;
