import FileIcon from './components/FileIcon';
import { FileType } from './interface';
import FileModal from './components/FileModal';
import { getFileFormat } from '@aicc/shared';
import './index.less';

type FileBaseProps = {
  file: FileType;
  preview?: boolean;
};

const FileBase = ({ file, preview }: FileBaseProps) => {
  const format = getFileFormat(file.path);

  return (
    <FileModal file={file} disabled={!preview}>
      <div className="aicc-file-card-row">
        <div className="aicc-file-card-content">
          <div className="aicc-file-card-name">{file.name}</div>
          <div className="aicc-file-card-meta">
            <div className="aicc-file-card-size">{file.size}</div>
          </div>
        </div>
        <div className="aicc-file-card-cover">
          <FileIcon format={format} width={30} height={40} />
        </div>
      </div>
    </FileModal>
  );
};

export default FileBase;
