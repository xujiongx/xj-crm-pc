import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Divider, InputNumber, Popover } from 'antd';
import AddAnimationPop from '../AddAnimationPop';
import styles from './index.less';

const ElementAnimationList = (props) => {
  const { list, deleteAnimation, updateAnimation, manualRunAnimation } = props;

  return (
    <div className={styles['list']}>
      {list.map((item) => (
        <div key={item.id} className={styles['item']}>
          <div className={styles['top']}>
            <div>
              效果：{item.name}-{item.effect}
            </div>
            <div>
              <PlayCircleOutlined
                onClick={() => {
                  manualRunAnimation(item.id);
                }}
              />
              <DeleteOutlined
                style={{ marginLeft: '8px' }}
                onClick={() => deleteAnimation(item.id)}
              />
            </div>
          </div>
          <Divider style={{ margin: '12px 0' }} />

          <div className={styles['operate']}>
            <div className={styles['operate-item']}>
              开始时间：
              <InputNumber
                value={item.start}
                onChange={(v) => {
                  updateAnimation(item.id, { start: v });
                }}
              />
            </div>
            <div className={styles['operate-item']}>
              结束时间：
              <InputNumber
                value={item.end}
                onChange={(v) => {
                  updateAnimation(item.id, { end: v });
                }}
              />
            </div>
          </div>

          <Popover
            content={
              <AddAnimationPop
                handleAddAnimation={(data) => {
                  updateAnimation(item.id, data);
                }}
                tab={item.type}
              />
            }
            trigger="click"
            placement="bottomRight"
          >
            <Button style={{ width: '100%', marginTop: '6px' }}>
              更换动画
            </Button>
          </Popover>
          {/* <Button onClick={() => deleteAnimation(item.id)}>删除动画</Button>
          <Button
            onClick={() => {
              manualRunAnimation(item.id);
            }}
          >
            播放动画
          </Button> */}
        </div>
      ))}
    </div>
  );
};

export default ElementAnimationList;
