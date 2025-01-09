import AUDIO_URL from '@/assets/bg.mp3';
import DEMO_URL from '@/assets/demo.mp3';
import useCreateElement from '@/pages/MotionVideo/components/PPTEditor/hooks/useCreateElement';
import { Button } from 'antd';

const AudioMaterial = () => {
  const { createAudioElement } = useCreateElement();
  const handleAddAudio = () => {
    console.log('新增音频');
    createAudioElement(AUDIO_URL);
  };
  const handleAddAudio2 = () => {
    console.log('新增音频2');
    createAudioElement(DEMO_URL);
  };

  return (
    <div>
      <Button onClick={() => handleAddAudio()}>新增音频</Button>
      <Button onClick={() => handleAddAudio2()}>新增音频</Button>
    </div>
  );
};

export default AudioMaterial;
