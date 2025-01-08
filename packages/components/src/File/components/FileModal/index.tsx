import { FileType } from '@/File/interface';
import { getFileFormat } from '@aicc/shared';
import { Modal, ModalProps } from 'antd';
import { Video } from 'qnzs-ui';
import { useState } from 'react';
import FileViewer from '../FileViewer';

interface FileModalProps {
  file: FileType;
  disabled?: boolean;
  /** 是否 需要下载 通过 url 下载文件 */
  needLoad?: boolean;
  children?: React.ReactNode;
  modalProps?: ModalProps;
}

const FileModal: React.FC<FileModalProps> = ({
  modalProps = { width: 600 },
  file,
  disabled,
  children,
  needLoad = false
}) => {
  const [open, setOpen] = useState(false);

  const renderViewer = () => {
    const format = getFileFormat(file.path);
    switch (format) {
      case 'wav':
      case 'mp3':
      case 'mp4':
        return <Video src={file.path} autoPlay playbackRate={false} />;
      default:
        return (
          <FileViewer
            fileSourceId={file.fileSourceId}
            name={file.name}
            src={file.path}
            needLoad={needLoad}
            style={{ height: '70vh' }}
          />
        );
    }
  };

  return (
    <>
      <Modal
        {...modalProps}
        title={
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              marginRight: '20px',
            }}
            title={file.name}
          >
            {file.name}
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
      >
        <div className="aicc-file-viewer-wrapper">{renderViewer()}</div>
      </Modal>
      <span onClick={() => !disabled && setOpen(true)}>{children}</span>
    </>
  );
};

export default FileModal;
