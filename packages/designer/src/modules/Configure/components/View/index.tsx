import { Form } from 'antd';
import { useEffect } from 'react';
import Color from '../../../../components/Configure/Color';
import useMainStore from '../../../../store';

const ViewConfigure = () => {
  const [form] = Form.useForm();
  const viewConfig = useMainStore((state) => state.viewConfig);
  const preview = useMainStore((store) => store.preview);

  useEffect(() => {
    form.setFieldsValue(viewConfig.style);
  }, [viewConfig.style]);

  return (
    <Form
      form={form}
      disabled={preview}
      onValuesChange={(value) => {
        useMainStore.getState().updateViewStyle(value);
      }}
      style={{ padding: '0 16px' }}
    >
      <Form.Item label="背景色" name="backgroundColor">
        <Color format="hex" showText />
      </Form.Item>
    </Form>
  );
};

export default ViewConfigure;
