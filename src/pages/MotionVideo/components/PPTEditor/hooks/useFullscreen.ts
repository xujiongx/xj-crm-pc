import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
} from '@/pages/MotionVideo/utils/fullscreen';
import { useEffect } from 'react';
import { useScreenStore } from '../store';

export default () => {
  const { screening, setScreening } = useScreenStore();

  const handleFullscreenChange = () => {
    setScreening(isFullscreen());
  };

  useEffect(() => {
    setScreening(isFullscreen());
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari 兼容
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange,
      );
    };
  }, []);

  const manualExitFullscreen = () => {
    if (!screening) return;
    exitFullscreen();
  };
  const manualEnterFullscreen = () => {
    if (screening) return;
    enterFullscreen();
  };

  return {
    screening,
    manualExitFullscreen,
    manualEnterFullscreen,
  };
};
