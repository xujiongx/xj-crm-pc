import { useEffect } from 'react';
import Canvas from '../Editor/modules/Canvas';
import Timeline from '../Editor/modules/TimeLine';
import { useSlidesStore } from '../Editor/store';

const Page = () => {
  const slidesData = localStorage.getItem('slides');

  useEffect(() => {
    if (slidesData) {
      useSlidesStore.getState().setSlides(JSON.parse(slidesData));
    }
  }, [slidesData]);
  return (
    <div>
      <Canvas />
      <Timeline />
    </div>
  );
};

export default Page;
