import useCreateElement from "@/pages/MotionVideo/PPTEditor/hooks/useCreateElement"
import { Button } from "antd"
import styles from "./index.less"

const VideoMaterial = () => {
  const { createVideoElement } = useCreateElement();

  const onAdd = () => {
    createVideoElement(
      'https://mazwai.com/videvo_files/video/free/2019-01/small_watermarked/181004_04_Dolphins-Whale_06_preview.webm',
    );
  };

  return (
    <div className={styles.list}>
      <Button onClick={() => onAdd()}>添加视频</Button>
    </div>
  );
};

export default VideoMaterial;
