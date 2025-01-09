import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import AudioMaterial from './AudioMaterial';
import ImageMaterial from './ImageMaterial';
import VideoMaterial from './VideoMaterial';

const Resources = () => {
  const TAB_MAP = [
    {
      key: '1',
      label: '图片',
      children: <ImageMaterial />,
    },
    {
      key: '2',
      label: '视频',
      children: <VideoMaterial />,
    },
    {
      key: '3',
      label: '音频',
      children: <AudioMaterial />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={TAB_MAP}
      centered={true}
      className={'configure-tabs'}
    >
      {TAB_MAP.map((e) => (
        <TabPane tab={e.label} key={e.key}>
          {e.children}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Resources;
