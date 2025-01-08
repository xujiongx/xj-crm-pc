import { downloadUrlFile } from '@aicc/shared';
import { UploadOutlined } from '@ant-design/icons';
import { Button, UploadProps } from 'antd';
import { FC } from 'react';
import Uploader from '../../../Uploader';

interface UploadFactoryProps extends UploadProps {
  value?: UploadProps['fileList'];
}

const UploadFactory: FC<UploadFactoryProps> = ({
  disabled,
  value,
  ...props
}) => {
  return (
    <Uploader
      maxCount={10}
      showUploadList={{ showDownloadIcon: true }}
      fileList={value}
      {...props}
      maxSize={20}
      action="/sys/common/upload"
      onDownload={(file) => {
        downloadUrlFile(file?.response?.msg);
      }}
    >
      {(value?.length || 0) < 10 ? (
        <Button icon={<UploadOutlined />} disabled={disabled}>
          上传文件
        </Button>
      ) : null}
    </Uploader>
  );
};

export default UploadFactory;
