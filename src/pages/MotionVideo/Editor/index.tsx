import PPTEditor from '../PPTEditor';
import useFullscreen from '../PPTEditor/hooks/useFullscreen';
import useGlobalHotkey from '../PPTEditor/hooks/useGlobalHotkey';
import Preview from '../Preview';

const Editor = () => {
  useGlobalHotkey();
  const { screening } = useFullscreen();
  if (screening) {
    return <Preview></Preview>;
  }
  return <PPTEditor />;
};

export default Editor;
