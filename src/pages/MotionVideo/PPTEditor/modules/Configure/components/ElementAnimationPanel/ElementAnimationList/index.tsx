import { Button, InputNumber, Popover } from 'antd';
import AddAnimationPop from '../AddAnimationPop';
import styles from './index.less';

const ElementAnimationList = (props) => {
  const { list, deleteAnimation, updateAnimation, manualRunAnimation } = props;

  return (
    <div className={styles['list']}>
      {list.map((item) => (
        <div key={item.id} className={styles['item']}>
          <p>
            效果：{item.name}-{item.effect}
          </p>
          <p>
            开始时间：
            <InputNumber
              value={item.start}
              onChange={(v) => {
                updateAnimation(item.id, { start: v });
              }}
            />
          </p>
          <p>
            结束时间：
            <InputNumber
              value={item.end}
              onChange={(v) => {
                updateAnimation(item.id, { end: v });
              }}
            />
          </p>

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
            <Button>更换动画</Button>
          </Popover>
          <Button onClick={() => deleteAnimation(item.id)}>删除动画</Button>
          <Button
            onClick={() => {
              manualRunAnimation(item.id);
            }}
          >
            播放动画
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ElementAnimationList;
