import { Button, Space } from 'antd';
import clsx from 'clsx';
import useFullscreen from '../../hooks/useFullscreen';
import useScreening from '../../hooks/useScreening';
import { useSlidesStore } from '../../store';
import styles from './index.less';
const Header = ({ className }: { className: string }) => {
  const slides = useSlidesStore((state) => state.slides);
  const { enterScreeningFromStart } = useScreening();

  const handleSave = () => {
    localStorage.setItem('slides', JSON.stringify(slides));
  };

  const handleExport = () => {
    history.pushState(null, '', `/api/slides/${slides[0].id}`);
  };
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
          console.log('👯videoURL', videoURL);
        };

        manualEnterFullscreen();
        mediaRecorder.start();

        // recordBtn.disabled = true;
        // stopBtn.disabled = false;
      })
      .catch((error) => {
        console.error('获取屏幕共享失败:', error);
      });
    // console.log('开始录屏');
    // // 获取video节点
    // const video = document.getElementsByClassName('viewport-background');
    // // 存储视频流
    // const videoData = [];
    // // 浏览器兼容Chrome和firefox
    // video.captureStream = video.captureStream || video.mozCaptureStream;
    // const mediaRecorder = new MediaRecorder(video.captureStream());
    // mediaRecorder.start();
    // // 当 MediaRecorder 将媒体数据传递到您的应用程序以供使用时，将触发该事件
    // mediaRecorder.ondataavailable = (e) => {
    //   console.log(e);
    //   // 添加视频流
    //   videoData.push(e.data);
    // };

    // // 录制结束回调
    // mediaRecorder.onstop = (e) => {
    //   const blob = new Blob(videoData, { type: 'video/mp4;codecs=vp8,opus' });

    //   const videoUrl = window.URL.createObjectURL(blob);
    //   open(videoUrl);
    // };
    // window.open()
  };

  return (
    <div className={clsx(className, styles.header)}>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
      </Space>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
        <Button onClick={() => handleExport()}>导出</Button>
        <Button onClick={() => enterScreeningFromStart()}>预览</Button>
        <Button onClick={() => handleRecoder()}>录制</Button>
      </Space>
    </div>
  );
};

export default Header;
