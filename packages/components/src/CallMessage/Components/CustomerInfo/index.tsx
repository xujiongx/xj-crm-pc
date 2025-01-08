import { Button, Form, FormProps, Input, Select } from 'antd';
import { FC, Fragment } from 'react';
import TitleDivider from '../../../TitleDivider';

/** 客户信息 */
export interface CustomerInfoType {
  custPhone: string | number;
  custName?: string;
  id?: string;
  remark?: string;
  idCard?: string;
  sex: number;
  age: number;
}

interface CustomerInfoProps extends FormProps {}

const CustomerInfo: FC<CustomerInfoProps> = ({ ...props }) => {
  /** 保存用户信息 */
  const onSubmit = async () => {
    const values = await props.form?.validateFields();
    const area = values.area?.join('-');
    props?.onFinish?.({ ...values, area });
  };

  return (
    <Fragment>
      <TitleDivider title="客户信息" />
      <Form {...props} onFinish={onSubmit}>
        <Form.Item label="客户姓名" name="custName">
          <Input
            placeholder="请输入客户姓名"
            maxLength={10}
            showCount={!props.disabled}
          />
        </Form.Item>
        <Form.Item
          name="custPhone"
          label="客户电话"
          rules={[{ required: true, message: '请输入客户电话' }]}
        >
          <Input disabled placeholder="请输入客户电话" />
        </Form.Item>
        <Form.Item label="性别" name="sex" initialValue={0}>
          <Select
            options={[
              { label: '未知', value: 0 },
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
          rules={[
            {
              pattern: /^[1-9](?:[0-9]*)$/,
              message: '请输入纯数字，不能以0开头',
            },
          ]}
        >
          <Input
            placeholder="请填写年龄"
            maxLength={3}
            showCount={!props.disabled}
          />
        </Form.Item>
        <Form.Item label="身份证" name="idCard">
          <Input
            placeholder="请填写身份证"
            maxLength={20}
            showCount={!props.disabled}
          />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea
            placeholder="请输入备注"
            maxLength={500}
            showCount={!props.disabled}
          />
        </Form.Item>
        {!props?.disabled ? (
          <Form.Item style={{ textAlign: 'right' }}>
            <Button htmlType="submit" type="primary">
              保存
            </Button>
          </Form.Item>
        ) : null}
      </Form>
    </Fragment>
  );
};

export default CustomerInfo;
