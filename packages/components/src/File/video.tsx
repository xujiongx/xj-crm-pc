import FileModal from './components/FileModal';
import { FileType } from './interface';
import './index.less';

interface VideoCardProps {
  file: FileType;
  name?: string;
  preview?: boolean;
}

const VideoCard = ({ file, preview }: VideoCardProps) => {
  return (
    <FileModal file={file} disabled={!preview}>
      <div className="aicc-file-video">
        <div className="aicc-file-video-play">
          <div className="aicc-file-video-player" />
        </div>
        <video controls={false} src={file.path} />
      </div>
    </FileModal>
  );
};

export default VideoCard;
