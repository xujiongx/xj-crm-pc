import { useEffect } from 'react';
import Preview from '../../components/Preview';
import { enterFullscreen } from '../../utils/fullscreen';
import { usePreview } from './hooks';

const Page = () => {
  const { data, dimensionRatio, toVideoStartPage, toVideoEndPage } =
    usePreview();

  useEffect(() => {
    enterFullscreen();
  }, []);
  if (!data) return null;

  return (
    <Preview
      PPTEditorData={data}
      dimensionRatio={dimensionRatio}
      toVideoStartPage={toVideoStartPage}
      toVideoEndPage={toVideoEndPage}
    />
  );
};

export default Page;
