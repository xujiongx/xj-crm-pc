import config from '@aicc/config';
import {
  getFileFormat,
  getToken,
  signature,
  stringifySignatureWithUrl,
  validFileFormat,
} from '@aicc/shared';
import { CrmApiResultType } from '@aicc/types';
import { Upload, UploadProps, message } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import UploaderForm from './form';

export interface UploaderProps extends Omit<UploadProps, 'accept'> {
  isDragger?: boolean;
  /** 存储文件夹 */
  storage?: string;
  /** 最大存储大小，单位MB */
  maxSize?: number | Record<string, number>;
  nameMaxLength?: number;
  /** 接受格式, 例如 ['png'] */
  acceptFormat?: string[];
  renderContent?: (
    fileList: UploaderFile[],
    loading: boolean,
  ) => React.ReactNode;
  formatUrl?: (data: any) => string;
  onFileChange?: (file: UploadFile<CrmApiResultType<any>>) => void;
}

export type UploaderFile = UploadFile<CrmApiResultType<string>>;

export const UPLOADER_FORMATS = {
  IMAGES: ['png', 'jpg', 'jpeg'],
  VIDEOS: ['mp4'],
  AUDIOS: ['mp3', 'wav'],
};

const DEFAULT_MINIO = '/sys/upload/uploadMinio';

const DEFAULT_FORMAT_URL = (url: string) =>
  url.startsWith('http') || url.startsWith(config.resourcePrefix)
    ? url
    : `${config.resourcePrefix}${url}`;

const defaultFileChange = (file: UploaderFile) => {
  if (file.status === 'done') {
    message.success(file.response?.msg || '上传成功');
  } else if (file.status === 'error') {
    message.success(file.response?.msg || '上传失败');
  }
};

const UploaderBase = ({
  isDragger,
  storage = 'default',
  action = DEFAULT_MINIO,
  acceptFormat,
  children,
  maxSize,
  maxCount = 1,
  nameMaxLength,
  renderContent,
  formatUrl = DEFAULT_FORMAT_URL,
  onFileChange = defaultFileChange,
  ...rest
}: UploaderProps) => {
  const [fileList, setFileList] = useState<Array<UploaderFile>>([]);
  const loading = fileList.some((item) => item.status === 'uploading');

  const UploadNode = isDragger
    ? Upload.Dragger
    : Upload<CrmApiResultType<string>>;

  useEffect(() => {
    if ('fileList' in rest) {
      setFileList(rest.fileList || []);
    }
  }, [rest.fileList]);

  const beforeUpload = (file: RcFile) => {
    if (maxSize) {
      if (typeof maxSize === 'number') {
        if (file.size / 1024 / 1024 > maxSize) {
          message.error(`文件大小不能超过${maxSize}MB`);
          return Upload.LIST_IGNORE;
        }
      } else if (typeof maxSize === 'object') {
        const format = getFileFormat(file.name);
        if (format in maxSize && file.size / 1024 / 1024 > maxSize[file.name]) {
          message.error(`${format}格式文件大小不能超过${maxSize[file.name]}MB`);
        }
      }
    }
    if (nameMaxLength && file.name?.length > nameMaxLength) {
      message.error('文件名长度过长，请重新上传文件');
      return Upload.LIST_IGNORE;
    }
    if (acceptFormat && !validFileFormat(file.name, acceptFormat)) {
      message.error(`请上传正确格式文件，支持：${acceptFormat.join('、')}`);
      return Upload.LIST_IGNORE;
    }
  };

  const onChange = ({
    file,
    fileList,
    ...uploadRest
  }: UploadChangeParam<UploaderFile>) => {
    let newFileList = fileList;
    let newFile = file;
    if (file.status === 'done') {
      newFileList = fileList.map((item) => changeFile(item));
      newFile = changeFile(file);
    }
    onFileChange?.(newFile);
    setFileList(newFileList);
    rest.onChange?.({
      ...uploadRest,
      file: newFile,
      fileList: newFileList,
    });
  };

  const changeFile = (file: UploaderFile) => ({
    ...file,
    url:
      file.response?.code === 0
        ? formatUrl(file.response?.result || '')
        : undefined,
    status: file.response
      ? file.response?.code === 0
        ? 'done'
        : 'error'
      : file.status,
  });

  const getData = async (file: UploadFile<CrmApiResultType<string>>) => {
    let data;
    if (typeof rest.data === 'function') {
      data = await rest.data(file);
    } else {
      data = rest.data || {};
    }
    return storage || data
      ? signature(
          action === DEFAULT_MINIO ? { biz: storage, ...data } : data,
          action,
        )
      : undefined;
  };

  return (
    <UploadNode
      beforeUpload={beforeUpload}
      disabled={loading}
      {...rest}
      fileList={fileList}
      maxCount={maxCount}
      accept={acceptFormat?.map((item) => `.${item}`).join(',')}
      data={getData}
      action={stringifySignatureWithUrl(action)}
      headers={{
        'X-Access-Token': getToken(),
        ...rest.headers,
      }}
      onChange={onChange}
    >
      {children}
      {renderContent?.(fileList, loading)}
    </UploadNode>
  );
};

const Uploader = UploaderBase as React.FunctionComponent<UploaderProps> & {
  Form: typeof UploaderForm;
};

Uploader.Form = UploaderForm;

export default Uploader;
