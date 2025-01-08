import { Form, Input } from 'antd';

const PhonemeForm = () => {
  return (
    <Form.Item
      label="强注音"
      required={false}
      tooltip="强注音每个注音之间必须用空格分割，且1-5分别代表第1声、第2声、第3、第4声、轻声，并确保注音正确，否则将无法播报。如：你好（ni3 hao3）"
      name="ph"
      rules={[{ required: true, message: '注音内容不能为空' }]}
    >
      <Input.TextArea
        placeholder="请输入注音内容"
        onPressEnter={(event) => event.preventDefault()}
        autoSize
      />
    </Form.Item>
  );
};

export default PhonemeForm;
