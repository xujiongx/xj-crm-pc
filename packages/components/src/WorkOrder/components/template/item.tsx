import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TimePicker,
  Typography,
} from 'antd';
import { FC } from 'react';
import type { SchemaWorkOrderItem } from '../../interface';
import Cascader from './cascader';
import Upload from './upload';

interface TemplateItemProps {
  schema: SchemaWorkOrderItem;
  orderStatus?: number;
  disabled?: boolean;
}

const TemplateItem: FC<TemplateItemProps> = ({
  schema,
  orderStatus,
  disabled,
}) => {
  const { fieldName, fieldId, fieldTypeD, fieldRequest } = schema;

  const renderLabel = () => (
    <Typography.Text ellipsis={{ tooltip: fieldName }}>
      {fieldName}
    </Typography.Text>
  );

  const renderFormType = () => {
    const TextInput = fieldName === '工单标题' ? Input.TextArea : Input;
    const maxLength = fieldName === '工单标题' ? 110 : 20;

    switch (fieldTypeD) {
      case 1:
        /** 文本组件 */
        return (
          <Form.Item
            name={fieldId}
            label={renderLabel()}
            rules={[
              { required: fieldRequest === 1, message: `${fieldName}不能为空` },
              { whitespace: true },
            ]}
          >
            <TextInput
              placeholder={`请输入${fieldName}`}
              maxLength={maxLength}
              allowClear
              showCount
              disabled={disabled}
            />
          </Form.Item>
        );
      case 2:
        /** 工单内容 */
        return (
          <Form.Item label={renderLabel()} required={fieldRequest === 1}>
            <Form.Item
              name={fieldId}
              rules={[
                {
                  required: fieldRequest === 1,
                  message: `${fieldName}不能为空`,
                },
                { whitespace: true },
              ]}
            >
              <Input.TextArea
                placeholder={`请输入${fieldName}`}
                maxLength={400}
                allowClear
                showCount
                disabled={disabled}
              />
            </Form.Item>
            {fieldName === '工单内容' && orderStatus !== 1 ? (
              <Form.Item
                noStyle
                name="orderFile"
                getValueFromEvent={(event) => {
                  if (Array.isArray(event)) return event;
                  return event?.fileList;
                }}
              >
                <Upload />
              </Form.Item>
            ) : null}
          </Form.Item>
        );
      case 3:
        return (
          <Form.Item
            name={fieldId}
            label={renderLabel()}
            rules={[
              {
                pattern: /^\d{1,20}$/,
                message: '文本类型为纯数字',
                validateTrigger: 'onChange',
              },
              {
                whitespace: true,
                message: '不能全为空格',
              },
              {
                required: fieldRequest === 1 ? true : false,
                message: `${fieldName}不能为空`,
              },
            ]}
          >
            <Input.TextArea
              maxLength={20}
              placeholder={`请输入${fieldName}`}
              allowClear
              disabled={disabled}
            />
          </Form.Item>
        );
      case 4:
      case 5:
        /** 下拉 */
        return (
          <Form.Item
            label={renderLabel()}
            name={fieldId}
            rules={[
              {
                required: fieldRequest === 1,
                message: `${fieldName}不能为空`,
              },
            ]}
          >
            <Select
              options={JSON.parse(schema?.fieldContent || '[]')}
              placeholder={schema.nullValuePrompt}
              mode={schema.fieldTypeD === 4 ? undefined : 'multiple'}
              disabled={disabled}
            />
          </Form.Item>
        );
      case 6:
        /** 级联 */
        return (
          <Form.Item
            label={renderLabel()}
            name={fieldId}
            rules={[
              {
                required: fieldRequest === 1,
                message: `${fieldName}不能为空`,
              },
            ]}
          >
            <Cascader schema={schema} />
          </Form.Item>
        );
      case 7:
        /** 单选 */
        return (
          <Form.Item
            label={renderLabel()}
            name={fieldId}
            rules={[
              {
                required: fieldRequest === 1,
                message: `${fieldName}不能为空`,
              },
            ]}
          >
            <Radio.Group
              options={JSON.parse(schema.fieldContent!)}
              disabled={disabled}
            />
          </Form.Item>
        );
      case 8:
        /** 单选 */
        return (
          <Form.Item
            label={renderLabel()}
            name={fieldId}
            rules={[
              {
                required: fieldRequest === 1,
                message: `${fieldName}不能为空`,
              },
            ]}
          >
            <Checkbox.Group
              options={JSON.parse(schema.fieldContent!)}
              disabled={disabled}
            />
          </Form.Item>
        );
      case 10:
        /** 时间 */
        return (
          <Form.Item
            label={renderLabel()}
            name={fieldId}
            rules={[
              {
                required: fieldRequest === 1,
                message: `${fieldName}不能为空`,
              },
            ]}
          >
            <TimePicker
              style={{ width: '100%' }}
              disabled={disabled}
              placeholder="请选择时间"
              format="HH:mm:ss"
            />
          </Form.Item>
        );
      case 9:
      case 11:
        return (
          <Form.Item
            label={renderLabel()}
            rules={[
              {
                required: fieldRequest === 1,
                message: `${fieldName}不能为空`,
              },
            ]}
            name={fieldId}
          >
            <DatePicker
              style={{ width: '100%' }}
              format={`YYYY-MM-DD${fieldTypeD !== 9 ? ' HH:mm:ss' : ''}`}
              showTime={fieldTypeD !== 9}
              disabled={disabled}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return renderFormType();
};

export default TemplateItem;
