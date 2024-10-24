import { Collapse, Form, Space, Switch } from 'antd';
import { useEffect } from 'react';
import ElementStyleConfiure from '../../../../components/Configure/Style';
import TitleConfiure from '../../../../components/Configure/Title';
import { TitleMaterial } from '../../../../elements/Title';
import useMainStore from '../../../../store';
import styles from './index.less';

const ElementConfigure = () => {
  const [form] = Form.useForm();

  const selectedElement = useMainStore((store) => store.selectedElement);
  const preview = useMainStore((store) => store.preview);

  const ElementTypeMap = useMainStore((store) => store.config.configsMap);

  useEffect(() => {
    if (selectedElement) {
      form.resetFields();
      form.setFieldsValue(selectedElement);
    }
  }, [selectedElement?.id]);

  const ComponentConfig = selectedElement
    ? ElementTypeMap[selectedElement.component]
    : null;

  if (!ComponentConfig) return null;

  const onValuesChange = () => {
    useMainStore.getState().onUpdateElement(form.getFieldsValue());
  };

  console.log(888, selectedElement, form.getFieldsValue());

  return (
    <Form
      disabled={preview}
      labelCol={{ span: 6 }}
      labelAlign="left"
      colon={false}
      wrapperCol={{ span: 18 }}
      form={form}
      onValuesChange={onValuesChange}
    >
      <div className={styles.card}>
        <ComponentConfig.component form={form} />
      </div>
      <Collapse
        defaultActiveKey={['title', 'style']}
        className={styles.collapse}
        expandIconPosition="end"
        ghost
        items={[
          {
            key: 'title',
            children: <TitleConfiure />,
            hidden: ComponentConfig.config?.hideTitle,
            label: (
              <Space>
                <span>标题设置</span>
                <Form.Item
                  noStyle
                  name={['decorator-props', 'title', 'visible']}
                  valuePropName="checked"
                >
                  <Switch
                    onChange={(checked) => {
                      if (checked) {
                        form.setFieldValue(['decorator-props', 'title'], {
                          visible: true,
                          ...TitleMaterial['component-props'],
                          ...form.getFieldValue(['decorator-props', 'title']),
                        });
                        onValuesChange();
                      }
                    }}
                    onClick={(_, e) => {
                      e.stopPropagation();
                    }}
                  />
                </Form.Item>
              </Space>
            ),
          },
          {
            key: 'style',
            label: '样式设置',
            children: <ElementStyleConfiure onValuesChange={onValuesChange} />,
            hidden: ComponentConfig.config?.hideStyle,
          },
        ].filter((item) => !item.hidden)}
      />
    </Form>
  );
};

export default ElementConfigure;
