import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styles from './index.less';

const Box = (props) => {
  const { item, handleDrop } = props;
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'page',
    item, //必须要有的,相当于id
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['page'],
      drop: (value) => {
        handleDrop?.(item, value);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [item],
  );

  return (
    <div
      ref={drop(drag(ref)) as any}
      style={{
        opacity: isOver ? 0.5 : 1,
        padding: '2px',
        margin: '2px',
        border: '1px dashed black',
        transition: 'all 0.2s ease-in-out',
        borderTop: isOver ? '1px dashed red' : '1px dashed black',
      }}
    >
      <div
        className={styles['item']}
        style={{
          margin: '2px',
          backgroundColor: isDragging ? 'yellow' : 'red',
        }}
      >
        {item.value}
      </div>
    </div>
  );
};

export default Box;
