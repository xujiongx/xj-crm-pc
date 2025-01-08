import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { useDebounceFn, useRequest, useSetState } from 'ahooks';
import {
  Button,
  Form,
  FormProps,
  Popconfirm,
  Radio,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import {
  ForwardRefRenderFunction as FC,
  ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { WORK_DOCUMENTS_PRIORITY } from '../../constant';
import type { SchemaWorkOrderItem } from '../../interface';
import { formatValue, parseValue } from '../../utils';
import TemplateItem from './item';

export interface WorkOrderTemplateRef {
  orderStatus?: 0 | 1;
  schemas?: SchemaWorkOrderItem[];
  /** 提交表单 */
  onSubmit: (status?: 1) => void;
}

interface WorkOrderTemplateProps {
  workOrderId?: string;
  params?: Record<string, any>;
  disabled?: boolean;
  manualCreate?: boolean;
  formProps?: FormProps;
  initialValues?: Record<string, string>;
  autoSave?: boolean;
  archive?: { text?: string };
  renderFooter?: (props: {
    orderStatus?: 0 | 1;
    schemas?: SchemaWorkOrderItem[];
    disabled?: boolean;
  }) => ReactNode;
}

const WorkOrderTemplate: FC<WorkOrderTemplateRef, WorkOrderTemplateProps> = (
  {
    workOrderId,
    params,
    initialValues,
    formProps,
    disabled,
    manualCreate,
    autoSave = true,
    archive,
    renderFooter,
  },
  ref,
) => {
  const { request } = useContext(ConfigContext);
  const [initForm] = Form.useForm();
  const [schemas, setSchemas] = useState<SchemaWorkOrderItem[]>();
  const [state, setState] = useSetState<{ orderStatus?: 0 | 1; id?: string }>(
    {},
  );

  const form = formProps?.form || initForm;

  /** 模版ID */
  const tid = Form.useWatch('tid', form);

  /** 查询工单模版 */
  const { data: templates, loading } = useRequest(async () => {
    const res = await request('/sus/workOrder/template/list', {
      params: { pageSize: 9999 },
    });
    if (res?.code !== 0) return [];
    const list = res?.result?.records
      ?.filter(({ status }) => status === 1)
      ?.map(({ templateName, id }) => ({
        label: templateName,
        value: id,
      }));
    if (manualCreate) form.setFieldsValue({ tid: list?.[0]?.value });
    return list;
  });

  /** 查询工单模版 */
  useRequest(
    async () => {
      const res = await request('/sus/workOrder/template/temlpageField', {
        params: { id: tid },
      });
      if (res?.code !== 0) return [];
      setSchemas(res?.result);
    },
    {
      ready: !!tid,
      refreshDeps: [tid],
      cacheKey: `work-order-${tid}`,
    },
  );

  useRequest(
    async () => {
      const res = await request('/sus/workOrder/manage/queryById', {
        params: { id: state?.id },
      });
      if (res?.code !== 0) return;
      const { fieldLists, templateId, priority, orderFile, orderStatus } =
        res?.result;
      const { schemas, values } = parseValue(fieldLists, { orderFile });
      setSchemas(schemas);
      setState({ orderStatus });
      form.setFieldsValue({
        ...values,
        tid: templateId,
        priority: `${priority}`,
      });
    },
    {
      ready: !!state?.id,
      refreshDeps: [state?.id],
    },
  );

  /**
   * 修改表单
   * @param orderStatus 是否归档 0否1是
   */
  const { run: onSubmit } = useDebounceFn(
    async (orderStatus?: 0 | 1) => {
      const values = await form.validateFields();
      const data = formatValue(schemas || [], values);
      const res = !state?.id
        ? await request('/sus/workOrder/manage/add', {
            method: 'POST',
            data: { ...data, orderStatus, ...(params || {}) },
          })
        : await request('/sus/workOrder/manage/edit', {
            method: 'PUT',
            data: { ...data, id: state?.id, orderStatus },
          });

      if (res?.code !== 0) return;

      if (manualCreate) setState({ id: res?.result?.id });
      message.success(res?.msg);
      setState({ orderStatus });
    },
    { wait: 1000 },
  );

  useImperativeHandle(ref, () => ({
    orderStatus: state?.orderStatus,
    schemas,
    onSubmit,
  }));

  useEffect(() => {
    if (workOrderId) {
      setState({ id: workOrderId });
    }
  }, [workOrderId, manualCreate]);

  const readOnly = state?.orderStatus === 1 || disabled;

  return (
    <Form
      initialValues={initialValues}
      labelCol={{ span: 4 }}
      onValuesChange={() => {
        if (!autoSave) return;
        onSubmit();
      }}
      {...formProps}
      disabled={readOnly}
      form={form}
    >
      <Form.Item
        label={
          <Typography.Text ellipsis={{ tooltip: '工单模版' }}>
            工单模版
          </Typography.Text>
        }
        name="tid"
        rules={[{ required: true, message: '工单模版不能为空' }]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          options={templates}
          loading={loading}
        />
      </Form.Item>
      {schemas?.map((schema) => (
        <TemplateItem key={schema?.fieldId} schema={schema} />
      ))}
      <Form.Item
        label={
          <Typography.Text ellipsis={{ tooltip: '优先级' }}>
            优先级
          </Typography.Text>
        }
        name="priority"
        rules={[{ required: true, message: '优先级不能为空' }]}
      >
        <Radio.Group options={WORK_DOCUMENTS_PRIORITY} />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: formProps?.labelCol?.span || 0,
        }}
      >
        {renderFooter ? (
          renderFooter?.({
            orderStatus: state?.orderStatus,
            schemas,
            disabled: readOnly,
          })
        ) : (
          <Space>
            {!autoSave ? (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => onSubmit()}
              >
                保存
              </Button>
            ) : null}
            {archive ? (
              <Popconfirm
                title="确认归档吗？归档后将不能再修改"
                onConfirm={() => onSubmit(1)}
              >
                <Button type="primary">{archive?.text || '归档'}</Button>
              </Popconfirm>
            ) : null}
          </Space>
        )}
      </Form.Item>
    </Form>
  );
};

export default forwardRef(WorkOrderTemplate);
