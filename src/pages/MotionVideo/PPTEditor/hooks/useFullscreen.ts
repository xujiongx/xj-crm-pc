import { useEffect } from 'react';
import { useScreenStore } from '../store';
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
} from '../utils/fullscreen';

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
