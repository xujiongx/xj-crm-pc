import { Form, Select } from 'antd';
import { interprets } from '../../constant';

const SayAsForm = () => {
  return (
    <Form.Item
      label="播报类型"
      required={false}
      name="interpretAs"
      rules={[{ required: true, message: '播报类型不能为空' }]}
    >
      <Select
        style={{ width: 150 }}
        options={interprets}
        placeholder="请选择播报类型"
      />
    </Form.Item>
  );
};

export default SayAsForm;
