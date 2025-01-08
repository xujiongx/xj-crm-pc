import { FC, ReactNode } from 'react';
import { Popover, Form, FormInstance, PopoverProps } from 'antd';
import PhonemeForm from './components/Phoneme/form';
import SayAsForm from './components/SayAs/form';

interface Props extends PopoverProps {
  type?: string;
  footer?: ReactNode;
  form: FormInstance;
}

const SSMLPopover: FC<Props> = ({ type, footer, form, children, ...props }) => {
  const renderForm = () => {
    switch (type) {
      case 'phoneme':
        return <PhonemeForm />;
      case 'say-as':
        return <SayAsForm />;
      default:
        return null;
    }
  };

  return (
    <Popover
      {...props}
      content={
        <Form form={form} layout="inline">
          {renderForm()}
          <Form.Item style={{ margin: 0, textAlign: 'right' }}>
            {footer}
          </Form.Item>
        </Form>
      }
    >
      {children}
    </Popover>
  );
};

export default SSMLPopover;
