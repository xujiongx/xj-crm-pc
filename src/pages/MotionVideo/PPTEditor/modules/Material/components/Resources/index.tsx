import { Tabs } from 'antd';
import VideoMaterial from './VideoMaterial'
import ImageMaterial from './ImageMaterial'

const Resources = () => {
  const TAB_MAP = [
    {
      key: '1',
      label: '图片',
      children: <ImageMaterial/>,
    },
    {
      key: '2',
      label: '视频',
      children: <VideoMaterial/>,
    },
  ];

  return (
    <Tabs style={{ padding: '0 12px' }} items={TAB_MAP} defaultActiveKey="1" />
  );
};

export default Resources;
