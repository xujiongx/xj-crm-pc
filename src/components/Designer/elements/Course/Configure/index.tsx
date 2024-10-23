import cardActiveImg from '@/assets/designer/card-active.png';
import cardImg from '@/assets/designer/card.png';
import imageActiveImg from '@/assets/designer/image-active.png';
import imageImg from '@/assets/designer/image.png';
import listActiveImg from '@/assets/designer/list-active.png';
import listImg from '@/assets/designer/list.png';
import titleActiveImg from '@/assets/designer/title-active.png';
import titleImg from '@/assets/designer/title.png';
import ImageRadio from '@aicc/designer/es/components/Configure/ImageRadio';
import { Form, InputNumber, Space, Switch, Typography } from 'antd';

interface ApplyConfigureProps {
  showCover?: boolean;
}

const ApplyConfigure = ({ showCover = true }: ApplyConfigureProps) => {
  return (
    <>
      <Form.Item name={['component-props', 'type']} noStyle>
        <ImageRadio
          options={[
            {
              label: '列表样式',
              image: listImg,
              activeImage: listActiveImg,
              hidden: !showCover,
              value: 'list',
            },
            {
              label: '大图样式',
              image: imageImg,
              activeImage: imageActiveImg,
              hidden: !showCover,
              value: 'image',
            },
            {
              label: '卡片样式',
              image: cardImg,
              activeImage: cardActiveImg,
              hidden: !showCover,
              value: 'card',
            },
            {
              label: '标题样式',
              image: titleImg,
              activeImage: titleActiveImg,
              value: 'title',
            },
          ].filter((item) => !item.hidden)}
        />
      </Form.Item>

      <Form.Item
        style={{ marginTop: 20 }}
        name={['component-props', 'showInfo']}
        label="信息栏字段"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name={['component-props', 'showNumber']}
        label="序号"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item name={['component-props', 'showCount']} label="显示个数">
        <InputNumber min={1} max={10} precision={0} />
      </Form.Item>

      <Form.Item label="空数据状态">
        <Space>
          <Form.Item
            noStyle
            name={['component-props', 'hideInEmpty']}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Typography.Text type="secondary">
            列表为空时，该组件隐藏
          </Typography.Text>
        </Space>
      </Form.Item>
    </>
  );
};

export default ApplyConfigure;
