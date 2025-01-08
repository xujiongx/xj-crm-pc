import { useSetState } from 'ahooks';
import { Button, Modal, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { FC, ReactNode } from 'react';
import Uploader, { UploaderProps } from '../../../Uploader';

interface UploadFileNameProps extends Omit<UploaderProps, 'children'> {
  children?: (options?: { loading: boolean; disabled?: boolean }) => ReactNode;
  refresh?: () => void;
  refreshAllUpload?: () => void;
}

const UploadFileName: FC<UploadFileNameProps> = ({
  acceptFormat = ['xlsx', 'xls'],
  showUploadList = false,
  children,
  disabled,
  refresh,
  refreshAllUpload,
  ...props
}) => {
  const [state, setState] = useSetState({
    uploading: false,
  });

  const showError = (text?: string) =>
    Modal.warning({
      title: '提示',
      content: text || '上传失败',
    });

  const handleUpload = (file: UploadFile) => {
    switch (file.status) {
      case 'done':
        if (file?.response.code === 0) {
          refresh?.();
          refreshAllUpload?.();
          message.success(file?.response.result || '上传成功');
        } else {
          showError(file?.response?.msg);
        }
        setState({ uploading: false });
        break;
      case 'error':
        showError(file?.response?.msg);
        setState({ uploading: false });
        break;
      case 'uploading':
        setState({ uploading: true });
        break;
      default:
        break;
    }
  };

  return (
    <Uploader
      {...props}
      showUploadList={showUploadList}
      disabled={state.uploading || disabled}
      onFileChange={handleUpload}
    >
      {children ? (
        children({ disabled, loading: state?.uploading })
      ) : (
        <Button loading={state?.uploading} disabled={disabled}>
          导入
        </Button>
      )}
    </Uploader>
  );
};

export default UploadFileName;
