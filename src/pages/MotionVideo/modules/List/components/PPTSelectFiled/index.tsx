import PPT_URL from '@/assets/mg/ppt.png';
import { validFileFormat } from '@aicc/shared';
import { message, Upload, UploadFile } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import styles from './index.less';

const PPTSelect = (props) => {
  const { value, onChange } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const accept = 'pptx';
  const excelMaxSize = 200;

  const uploadProps: DraggerProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file: UploadFile) => {
      if (!validFileFormat(file.name, accept.split(','))) {
        message.error('请上传pptx格式的文件');
      } else if (file && file.size && file.size > excelMaxSize * 1024 * 1024) {
        message.error(`文件不能大于${excelMaxSize}M`);
      } else {
        setFileList([file]);
        onChange(file);
      }
      return false;
    },
    accept,
    fileList,
    onRemove: () => {
      setFileList([]);
    },
  };

  useEffect(() => {
    if (!value) return;
    setFileList([value]);
  }, [value]);

  return (
    <div>
      <Upload.Dragger {...uploadProps}>
        <div className={styles['ant-upload']}>
          <div
            className={styles['img']}
            style={{
              backgroundImage: `url('${PPT_URL}')`,
            }}
          ></div>
          <div className={styles['ant-upload-text']}>
            点击或将文件拖拽至此处上传
          </div>
        </div>
      </Upload.Dragger>
    </div>
  );
};

export default PPTSelect;
