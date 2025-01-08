import IconFont from '../../../IconFont';
import { prefix } from '../../index';
import './index.less';

export interface PlayIconProps {
  playing?: boolean;
  className?: string;
}

const PlayIcon = ({ playing, className }: PlayIconProps) => {
  if (!playing) {
    return (
      <span className={`${prefix}-play-icon ${className || ''}`}>
        <IconFont
          className={`${prefix}-play-icon-frame`}
          type="icon-voice_frame_3"
        />
      </span>
    );
  }

  return (
    <span className={`${prefix}-play-icon ${className || ''}`}>
      <span className={`${prefix}-play-icon-wrapper`}>
        <IconFont
          className={`${prefix}-play-icon-frame`}
          type="icon-voice_frame_1"
        />
        <IconFont
          className={`${prefix}-play-icon-frame`}
          type="icon-voice_frame_2"
        />
        <IconFont
          className={`${prefix}-play-icon-frame`}
          type="icon-voice_frame_3"
        />
      </span>
    </span>
  );
};

export default PlayIcon;
