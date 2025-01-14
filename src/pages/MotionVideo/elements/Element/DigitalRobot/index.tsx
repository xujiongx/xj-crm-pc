import clsx from 'clsx';
import useElementFlip from '../../hooks/useElementFlip';
import useElementShadow from '../../hooks/useElementShadow';
import { filters2Style } from '../Image/utils';
import styles from './index.less';

const DigitalRobot = (props) => {
  const { element, onSelect } = props;

  const shadow = element.shadow;
  const { shadowStyle } = useElementShadow(shadow);

  const flipH = element.flipH;
  const flipV = element.flipV;
  const { flipStyle } = useElementFlip(flipH, flipV);

  const handleSelectElement = (
    e: React.MouseEvent | React.TouchEvent,
    canMove = true,
  ) => {
    e.stopPropagation();
    onSelect(e, element, canMove);
  };

  return (
    <div
      className={clsx({
        [styles['editable-element-digital-robot']]: true,
        [styles['lock']]: element.lock,
      })}
      style={{
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{ transform: `rotate(${element.rotate}deg)` }}
      >
        <div
          className={styles['element-content']}
          style={{
            opacity: element.opacity,
            filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
            transform: flipStyle,
          }}
          onMouseDown={(event) => handleSelectElement(event)}
          onTouchStart={(event) => handleSelectElement(event)}
        >
          <div className={clsx(styles['digital-robot-content'])}>
            <img
              src={element.src}
              alt="digital-robot"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                filter: filters2Style(element.filters || {}),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalRobot;
