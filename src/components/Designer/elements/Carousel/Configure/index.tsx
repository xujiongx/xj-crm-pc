import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Radio, Space, Typography } from 'antd';
import ColumnSelect from '../../../components/Configure/Column';
import Sorter from '../../../components/Configure/Sorter';
import SorterItem from '../../../components/Configure/Sorter/item';
import Uploader from '../../../components/Configure/Uploader';
import ImageUploader from '../../../components/Configure/Uploader/image';
import { DefaultCarouselConfig } from '../default';
import styles from './index.less';

const CarouselConfigure = () => {
  return (
    <>
      <Form.Item label="选择模式" name={['component-props', 'height']}>
        <Radio.Group className="ant-radio-block">
          <Radio.Button value="180px">大图轮播</Radio.Button>
          <Radio.Button value="120px">小图轮播</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Space direction="vertical">
        <Typography.Text strong style={{ display: 'block' }}>
          上传图片
        </Typography.Text>

        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          <Space align="start">
            <InfoCircleOutlined />
            图片比例为，建议宽度750px，图片支持jpg/jpeg/png格式，且单张图片大小不超过2M，鼠标拖拽调整顺序
          </Space>
        </Typography.Text>

        <Form.List name={['component-props', 'images']}>
          {(fields, { add, remove, move }) => (
            <Sorter
              items={fields.map((field) => field.key.toString())}
              onDragEnd={({ active, over }) => {
                if (active.id !== over?.id) {
                  const activeIndex = fields.findIndex(
                    (i) => i.key.toString() === active.id,
                  );
                  const overIndex = fields.findIndex(
                    (i) => i.key.toString() === over?.id,
                  );
                  move(activeIndex, overIndex);
                }
              }}
            >
              {fields.map(({ key, name, ...restField }, index) => (
                <SorterItem
                  id={key.toString()}
                  key={key}
                  disabledRemove={fields.length <= 1}
                  onRemove={() => remove(index)}
                >
                  <div className={styles.item}>
                    <Form.Item
                      {...restField}
                      label="图片地址"
                      name={[name, 'imgUrl']}
                      noStyle
                    >
                      <ImageUploader />
                    </Form.Item>
                    <div className={styles['item-content']}>
                      <Form.Item
                        style={{ marginBottom: 10 }}
                        label="跳转方式"
                        name={[name, 'linkStyle']}
                      >
                        <Radio.Group>
                          <Radio.Button value="column">栏目列表</Radio.Button>
                          <Radio.Button value="link">链接</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, next) =>
                          prev['component-props']?.['images']?.[index]?.[
                            'linkStyle'
                          ] !==
                          next['component-props']?.['images']?.[index]?.[
                            'linkStyle'
                          ]
                        }
                      >
                        {({ getFieldValue }) => {
                          return getFieldValue([
                            'component-props',
                            'images',
                            index,
                            'linkStyle',
                          ]) === 'column' ? (
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              label="选择栏目"
                              name={[name, 'column']}
                            >
                              <ColumnSelect />
                            </Form.Item>
                          ) : (
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              label="跳转链接"
                              name={[name, 'link']}
                            >
                              <Input placeholder="请输入跳转链接" />
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                    </div>
                  </div>
                </SorterItem>
              ))}
              <Uploader
                number={fields.length}
                maxCount={5}
                onUpload={(imgUrl) => {
                  add({
                    ...DefaultCarouselConfig['component-props']?.images?.[0],
                    imgUrl,
                  });
                }}
              />
            </Sorter>
          )}
        </Form.List>
      </Space>
    </>
  );
};

export default CarouselConfigure;
