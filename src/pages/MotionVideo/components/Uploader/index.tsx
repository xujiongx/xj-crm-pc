import { getToken, stringifySignatureWithUrl } from '@aicc/shared';
import { Upload, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import React from 'react';
import styles from './index.less';

export const ImageAcceptType = ['jpg', 'jpeg', 'png'];
export const VideoAcceptType = ['mp4'];
export const AudioAcceptType = ['mpeg', 'mp3', 'wav', 'ogg'];

const acceptTypeMap = {
  image: ImageAcceptType,
  video: VideoAcceptType,
  audio: AudioAcceptType,
};

export const beforUpload = (
  file: RcFile,
  type: 'image' | 'video' | 'audio',
) => {
  const acceptType = acceptTypeMap[type];
  const maxSize = type === 'image' ? 5 : 1024;
  console.log('👢', acceptType, type, file.type);
  if (!acceptType.map((item) => `${type}/${item}`).includes(file.type)) {
    message.error(
      `上传失败，格式错误，仅支持${acceptType.join('/')}格式${
        type === 'image' ? '图片' : '素材'
      }`,
    );
    return false;
  } else if (file.size > maxSize * 1024 * 1024) {
    message.error(
      `上传失败，单个${type === 'image' ? '图片' : '素材'}大小限制${
        type === 'image' ? '5M' : '1G'
      }以内`,
    );
    return false;
  }
  return true;
};

interface UploaderProps {
  type?: 'image' | 'video' | 'audio';
  number?: number;
  maxCount: number;
  disabled?: boolean;
  action?: string;
  onUpload?: (url: string) => void;
  children: React.ReactNode;
}

const AcceptType = {
  image: ImageAcceptType,
  video: VideoAcceptType,
  audio: AudioAcceptType,
};

const Uploader = ({
  type = 'image',
  maxCount,
  onUpload,
  children,
  action = '/srb/mg/files/upload',
}: UploaderProps) => {
  const uploadConfig = {
    headers: { 'X-Access-Token': getToken()!, mode: 'sign_test' },
    action: stringifySignatureWithUrl(action),
  };

  return (
    <Upload
      showUploadList={false}
      headers={uploadConfig.headers}
      className={styles.card}
      maxCount={maxCount}
      accept={AcceptType[type].map((accept) => `.${accept}`).join(',')}
      action={uploadConfig.action}
      beforeUpload={(file) => beforUpload(file, type)}
      onChange={({ file }) => {
        if (file.status === 'done') {
          if (file.response?.code === 0) {
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
