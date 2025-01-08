import { Image } from 'antd';
import FileBase from './base';
import { FileType } from './interface';
import VideoCard from './video';
import { getFileFormat } from '@aicc/shared';
import './index.less';

type FileCardType = {
  file: FileType;
  preview?: boolean;
  style?: React.CSSProperties;
};

const FileCard = ({ file, preview = false, style }: FileCardType) => {
  const renderFile = () => {
    const format = getFileFormat(file.path);
    switch (format) {
      case 'mp4':
        return <VideoCard file={file} preview={preview} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image preview={preview} src={file.path} alt={file.name} />;
      default:
        return <FileBase preview={preview} file={file} />;
    }
  };

  return (
    <div className="aicc-file-card" style={style}>
      {renderFile()}
    </div>
  );
};

export default FileCard;
