import IconFont from '@/components/IconFont';
import useDragElement from '@/pages/MotionVideo/PPTEditor/hooks/useDragElement';
import useSelectElement from '@/pages/MotionVideo/PPTEditor/hooks/useSelectElement';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { Space } from 'antd';
import clsx from 'clsx';
import styles from './index.less';

const ElementList = (props: any) => {
  const { listStyle, domRef, timelineState, data } = props;

  const currentSlide = useSlidesStore((state) => state.currentSlide);

  const { drag } = useDragElement(currentSlide()?.elements);

  const { select } = useSelectElement(currentSlide()?.elements, drag);

  const handleSelectElement = (e, item) => {
    select(e, item);
  };

  return (
    <div className={styles['container']}>
      <div className={styles['operate']}>
        <Space align="center">
          <IconFont type="icon-user" />
          <IconFont type="icon-user" />
        </Space>
      </div>
      <div
        ref={domRef}
        onScroll={(e) => {
          const { scrollTop } = e.target as HTMLDivElement;
          domRef.current.scrollTop = scrollTop;
          timelineState.current.setScrollTop(scrollTop);
        }}
        className={styles['timeline-list']}
        style={{ ...listStyle }}
      >
        {data.map((item) => {
          return (
            <div
              className={clsx({
                [styles['timeline-list-item']]: true,
                [styles['timeline-list-item-active']]: item.selected,
              })}
              key={item.id}
              onClick={(e) => handleSelectElement(e, item)}
            >
              <div className={styles['text']}>{`row-${item.name}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementList;
