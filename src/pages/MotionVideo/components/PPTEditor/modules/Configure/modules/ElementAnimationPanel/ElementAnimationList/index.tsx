import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import { CloseSmall, PlayOne } from '@icon-park/react';
import { Button, Divider, InputNumber, Popover } from 'antd';
import AddAnimationPop from '../AddAnimationPop';
import styles from './index.less';

const TYPE_NAME_MAP: Record<string, string> = {
  in: '入场',
  attention: '强调',
  out: '退场',
  video: '视频',
  audio: '音频',
};

const ElementAnimationList = (props) => {
  const { list, deleteAnimation, updateAnimation, manualRunAnimation } = props;
  const activeActionId = useMainStore((state) => state.activeActionId);
  const isVideoAnimation = (item) => {
    return item.type === 'video' || item.type === 'audio';
  };
  const setActiveActionId = useMainStore((state) => state.setActiveActionId);
  return (
    <div className={styles['list']}>
      {list.map((item, index) => (
        <div
          key={item.id}
          className={styles['item']}
          onClick={() => setActiveActionId(item.id)}
          style={{
            borderColor: item.id === activeActionId ? '#568DFE' : '#ccc',
          }}
        >
          <div className={styles['top']}>
            <div>
              {index + 1}【{TYPE_NAME_MAP[item.type]}】{item.name}
            </div>
            <div
              style={{
                fontSize: '15px',
              }}
            >
              {!isVideoAnimation(item) && (
                <PlayOne
                  onClick={() => {
                    manualRunAnimation(item.id);
                  }}
                />
              )}
              <CloseSmall
                style={{ marginLeft: '8px' }}
                onClick={() => deleteAnimation(item.id)}
              />
            </div>
          </div>
          {item.id === activeActionId && (
            <>
              <Divider style={{ margin: '12px 0' }} />

              <div className={styles['operate']}>
                <div className={styles['operate-item']}>
                  <div className={styles['text']}>开始时间：</div>
                  <InputNumber
                    value={item.start}
                    onChange={(v) => {
                      updateAnimation(item.id, { start: v });
                    }}
                    addonAfter="s"
                  />
                </div>
                <div className={styles['operate-item']}>
                  <div className={styles['text']}>结束时间：</div>
                  <InputNumber
                    value={item.end}
                    onChange={(v) => {
                      updateAnimation(item.id, { end: v });
                    }}
                    addonAfter="s"
                  />
                </div>
              </div>

              {!isVideoAnimation(item) && (
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
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ElementAnimationList;
