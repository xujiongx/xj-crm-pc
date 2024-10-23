import { Divider, Form, Radio } from 'antd';
import {
  DefaultTemplateCardStyle,
  DefaultTemplateFullStyle,
} from '../../../constants';
import Border from '../Border';
import BorderRadius from '../BorderRadius';
import BoxShadow from '../BoxShadow';
import Color from '../Color';
import Margin from '../Margin';

const ElementStyleConfiure = ({
  onValuesChange,
}: {
  onValuesChange: (values: any) => void;
}) => {
  const form = Form.useFormInstance();

  return (
    <>
      <Form.Item noStyle name={['decorator-props', 'template']}>
        <Radio.Group
          style={{ marginBottom: 20 }}
          className="ant-radio-block"
          onChange={(e) => {
            form.setFieldValue(
              ['decorator-props', 'style'],
              e.target.value === 'full'
                ? DefaultTemplateFullStyle
                : DefaultTemplateCardStyle,
            );
            onValuesChange(form.getFieldsValue());
          }}
        >
          <Radio.Button value="full">通栏式</Radio.Button>
          <Radio.Button value="card">卡片式</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="组件边距" name={['decorator-props', 'style', 'margin']}>
        <Margin />
      </Form.Item>
      <Form.Item
        label="圆角大小"
        name={['decorator-props', 'style', 'borderRadius']}
      >
        <BorderRadius />
      </Form.Item>
      <Divider />
      <Form.Item label="描边粗细" name={['decorator-props', 'style', 'border']}>
        <Border />
      </Form.Item>
      <Form.Item
        label="阴影样式"
        name={['decorator-props', 'style', 'boxShadow']}
      >
        <BoxShadow />
      </Form.Item>
      <Divider />
      <Form.Item
        label="背景颜色"
        name={['decorator-props', 'style', 'backgroundColor']}
      >
        <Color />
      </Form.Item>
    </>
  );
};

export default ElementStyleConfiure;
