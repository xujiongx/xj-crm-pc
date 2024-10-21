import Color from '@/components/Decoration/components/Configure/Color';
import ColumnSelect from '@/components/Decoration/components/Configure/Column';
import IconRadio from '@/components/Decoration/components/Configure/IconRadio';
import { Divider, Form, Input, Radio, Switch } from 'antd';

const TitleConfigure = () => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prev, next) =>
        prev['decorator-props']?.['title']?.['visible'] !==
        next['decorator-props']?.['title']?.['visible']
      }
    >
      {({ getFieldValue }) => {
        const hidden = !getFieldValue(['decorator-props', 'title', 'visible']);
        return (
          <>
            <Form.Item
              hidden={hidden}
              label="标题文字"
              name={['decorator-props', 'title', 'title']}
            >
              <Input placeholder="请输入标题文字" maxLength={20} showCount />
            </Form.Item>
            <Form.Item
              hidden={hidden}
              label="文字大小"
              name={['decorator-props', 'title', 'fontSize']}
            >
              <Radio.Group>
                <Radio.Button value="16px">小</Radio.Button>
                <Radio.Button value="18px">常规</Radio.Button>
                <Radio.Button value="20px">大</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              hidden={hidden}
              label="文字加粗"
              valuePropName="checked"
              name={['decorator-props', 'title', 'fontWeight']}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              hidden={hidden}
              label="文字颜色"
              name={['decorator-props', 'title', 'color']}
            >
              <Color />
            </Form.Item>
            <Form.Item
              hidden={hidden}
              label="标题图标"
              name={['decorator-props', 'title', 'icon']}
            >
              <IconRadio
                icons={Array.from({ length: 11 }).map(
                  (_, index) => `icon-${index + 2}`,
                )}
              />
            </Form.Item>
            <Form.Item
              hidden={hidden}
              label="图标颜色"
              name={['decorator-props', 'title', 'iconColor']}
            >
              <Color />
            </Form.Item>
            {!hidden && <Divider />}
            <Form.Item
              hidden={hidden}
              label="右侧文字"
              name={['decorator-props', 'title', 'more']}
            >
              <Input placeholder="请输入右侧文字" maxLength={10} showCount />
            </Form.Item>
            <Form.Item
              hidden={hidden}
              label="跳转方式"
              name={['decorator-props', 'title', 'moreLinkStyle']}
            >
              <Radio.Group>
                <Radio.Button value="column">栏目列表</Radio.Button>
                <Radio.Button value="link">链接</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, next) =>
                prev['decorator-props']?.['title']?.['moreLinkStyle'] !==
                next['decorator-props']?.['title']?.['moreLinkStyle']
              }
            >
              {({ getFieldValue }) => {
                return getFieldValue([
                  'decorator-props',
                  'title',
                  'moreLinkStyle',
                ]) === 'column' ? (
                  <Form.Item
                    hidden={hidden}
                    label="选择栏目"
                    name={['decorator-props', 'title', 'moreColumn']}
                  >
                    <ColumnSelect />
                  </Form.Item>
                ) : (
                  <Form.Item
                    hidden={hidden}
                    label="跳转链接"
                    name={['decorator-props', 'title', 'moreLink']}
                  >
                    <Input placeholder="请输入跳转链接" />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </>
        );
      }}
    </Form.Item>
  );
};

export default TitleConfigure;
