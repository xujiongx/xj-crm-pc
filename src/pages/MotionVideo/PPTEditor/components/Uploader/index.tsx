import { Upload, message } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import { RcFile } from 'antd/es/upload';
import React from 'react';
import { getToken, stringifySignatureWithUrl } from '@aicc/shared';
import styles from './index.less';

export const ImageAcceptType = ['jpg', 'jpeg', 'png'];
export const VideoAcceptType = ['mp4'];

export const beforUpload = (file: RcFile, type: 'image' | 'video') => {
  const acceptType = type === 'image' ? ImageAcceptType : VideoAcceptType;
  const maxSize = type === 'image' ? 2 : 1024;
  if (
    !acceptType
      .map((item) => `${type === 'image' ? 'image' : 'video'}/${item}`)
      .includes(file.type)
  ) {
    message.error(
      `上传失败，格式错误，仅支持${acceptType.join('/')}格式${
        type === 'image' ? '图片' : '视频'
      }`,
    );
    return false;
  } else if (file.size > maxSize * 1024 * 1024) {
    message.error(
      `上传失败，单个${type === 'image' ? '图片' : '视频'}大小限制${
        type === 'image' ? '2M' : '1G'
      }以内`,
    );
    return false;
  }
  return true;
};

interface UploaderProps {
  type?: 'image' | 'video';
  number: number;
  maxCount: number;
  disabled?: boolean;
  onUpload?: (url: string) => void;
  children: React.ReactNode;
}

const AcceptType = {
  image: ImageAcceptType,
  video: VideoAcceptType,
};

const Uploader = ({
  type = 'image',
  number,
  maxCount,
  onUpload,
  disabled: customDisabled,
  children,
}: UploaderProps) => {
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = (customDisabled ?? disabled) || maxCount <= number;
  const uploadConfig = {
    headers: { 'X-Access-Token': getToken()!, mode: 'sign_test' },
    action: stringifySignatureWithUrl('/scp/exam/file/common/upload'),
  };

  return (
    <Upload
      showUploadList={false}
      headers={uploadConfig.headers}
      className={styles.card}
      disabled={mergedDisabled}
      accept={AcceptType[type].map((accept) => `.${accept}`).join(',')}
      action={uploadConfig.action}
      beforeUpload={(file) => beforUpload(file, type)}
      onChange={({ file }) => {
        if (file.status === 'done') {
          if (file.response?.code === 0 && file.response.result) {
            onUpload?.(file.response.result);
          } else {
            message.error('上传失败');
          }
        } else if (file.status === 'error') {
          message.error('上传失败');
        }
      }}
    >
      {children}
    </Upload>
  );
};

export default Uploader;
