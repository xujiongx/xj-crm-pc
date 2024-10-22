import { Form, Input } from 'antd';

const DemoConfig = () => {
  return (
    <>
      {/* <Form.Item label="选择模式" name={['component-props', 'height']}>
        <Radio.Group className="ant-radio-block">
          <Radio.Button value="180px">大图轮播</Radio.Button>
          <Radio.Button value="120px">小图轮播</Radio.Button>
        </Radio.Group>
      </Form.Item> */}
      <Form.Item
        label="标题"
        name={['component-props', 'title']}
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default DemoConfig;
