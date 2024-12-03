import IconFont from '@/components/IconFont';
import useDeleteElements from '@/pages/MotionVideo/PPTEditor/hooks/useDeleteElements';
import useDragElement from '@/pages/MotionVideo/PPTEditor/hooks/useDragElement';
import useHideElement from '@/pages/MotionVideo/PPTEditor/hooks/useHideElement';
import useSelectElement from '@/pages/MotionVideo/PPTEditor/hooks/useSelectElement';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
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

  const { toggleHideElement, showAllElements, hideAllElements } =
    useHideElement();

  const handleElementId = useMainStore((store) => store.activeElementId);

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  const isHidden = hiddenElementIdList.includes(handleElementId);

  const { deleteElement } = useDeleteElements();
  const handleDeleteElement = () => {
    deleteElement();
  };

  return (
    <div className={styles['container']}>
      <div className={styles['operate']}>
        <Space align="center">
          <IconFont
            type="icon-user"
            onClick={() => {
              toggleHideElement(handleElementId);
            }}
          />
          {isHidden ? '显示' : '隐藏'}
          <IconFont type="icon-user" onClick={() => handleDeleteElement()} />
          删除
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
              <div className={styles['text']}>
                {`row-${item.name}`}
                <span>
                  <IconFont
                    type="icon-user"
                    onClick={() => {
                      toggleHideElement(item.id);
                    }}
                  />
                  {hiddenElementIdList.includes(item.id) ? '显示' : '隐藏'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementList;
