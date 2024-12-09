import { LeftOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import clsx from 'clsx';
import useFullscreen from '../../hooks/useFullscreen';
import useScreening from '../../hooks/useScreening';
import { useMainStore, useSlidesStore } from '../../store';
import styles from './index.less';
const Header = ({ className }: { className: string }) => {
  const slides = useSlidesStore((state) => state.slides);
  const hiddenElementIdList = useMainStore(
    (state) => state.hiddenElementIdList,
  );
  const { enterScreeningFromStart } = useScreening();

  const handleSave = () => {
    localStorage.setItem('slides', JSON.stringify(slides));
    localStorage.setItem(
      'hiddenElementIdList',
      JSON.stringify(hiddenElementIdList),
    );
  };

  const handleExport = () => {};
  const { manualEnterFullscreen } = useFullscreen();

  const handleRecoder = () => {
    const recordedChunks = [];
    navigator.mediaDevices
      .getDisplayMedia({ video: { displaySurface: 'monitor' }, audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, {
            type: 'video/mp4;codecs=vp8,opus',
          });
          const videoURL = URL.createObjectURL(blob);
          // videoPlayer.src = videoURL;
          window.open(videoURL);
        };

        manualEnterFullscreen();
        mediaRecorder.start();

        // recordBtn.disabled = true;
        // stopBtn.disabled = false;
      })
      .catch((error) => {
        console.error('获取屏幕共享失败:', error);
      });
  };

  return (
    <div className={clsx(className, styles.header)}>
      <Space style={{ cursor: 'pointer' }} onClick={() => history.back()}>
        <LeftOutlined />
        返回
      </Space>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
        {/* <Button onClick={() => handleExport()}>导出</Button> */}
        <Button onClick={() => enterScreeningFromStart()}>预览</Button>
        <Button onClick={() => handleRecoder()}>录制</Button>
      </Space>
    </div>
  );
};

export default Header;
