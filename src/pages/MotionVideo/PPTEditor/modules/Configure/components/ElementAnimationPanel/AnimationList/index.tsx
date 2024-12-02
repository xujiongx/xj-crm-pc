import {
  ANIMATION_CLASS_PREFIX,
  ATTENTION_ANIMATIONS,
  ENTER_ANIMATIONS,
  EXIT_ANIMATIONS,
} from '@/pages/MotionVideo/PPTEditor/config';
import clsx from 'clsx';

import { useState } from 'react';
import styles from './index.less';

const AnimationList = (props) => {
  const { type, handleAddAnimation } = props;
  const [hoverPreviewAnimation, setHoverPreviewAnimation] = useState('');

  const animations = {
    in: ENTER_ANIMATIONS,
    out: EXIT_ANIMATIONS,
    attention: ATTENTION_ANIMATIONS,
  };

  return (
    <div
      className={clsx({
        [styles['animation-pool']]: true,
        [styles[type]]: true,
      })}
      style={{ width: '400px', height: '400px', overflowY: 'scroll' }}
    >
      {animations[type].map((item) => (
        <div key={item.type} className={styles['pool-type']}>
          <div className={styles['type-title']}>{item.name}</div>
          <div className={styles['pool-item-wrapper']}>
            {item.children.map((action) => (
              <div
                key={action.value}
                className={styles['pool-item']}
                onMouseEnter={() => {
                  setHoverPreviewAnimation(action.value);
                }}
                onMouseLeave={() => {
                  setHoverPreviewAnimation('');
                }}
                onClick={() =>
                  handleAddAnimation({
                    type,
                    effect: action.value,
                    name: action.name,
                  })
                }
              >
                <div
                  className={clsx({
                    [styles['animation-box']]: true,
                    [`${ANIMATION_CLASS_PREFIX}animated`]: true,
                    [`${ANIMATION_CLASS_PREFIX}fast`]: true,
                    [`${ANIMATION_CLASS_PREFIX}${action.value}`]:
                      hoverPreviewAnimation === action.value,
                  })}
                >
                  {action.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimationList;
