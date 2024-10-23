import { Form } from 'antd';
import Color from '../../../../components/Configure/Color';
import useMainStore from '../../../../store';

const ViewConfigure = () => {
  const viewConfig = useMainStore((state) => state.viewConfig);
  const preview = useMainStore((store) => store.preview);

  return (
    <Form
      disabled={preview}
      initialValues={viewConfig.style}
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
