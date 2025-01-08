import useDeleteElements from '@/pages/MotionVideo/components/PPTEditor/hooks/useDeleteElements';
import useHideElement from '@/pages/MotionVideo/components/PPTEditor/hooks/useHideElement';
import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import { PPTElement } from '@/pages/MotionVideo/interface';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  AddText,
  GraphicDesign,
  Lock,
  Pic,
  Unlock,
  VideoTwo,
} from '@icon-park/react';
import { Flex, Popconfirm } from 'antd';
import clsx from 'clsx';
import { useEffect } from 'react';
import useLockElement from '../../../../hooks/useLockElement';
import { useElement } from '../../hooks';
import styles from './index.less';

const NAME_MAP: Record<
  string,
  {
    icon: React.ReactElement;
    name: string;
  }
> = {
  video: {
    icon: <VideoTwo />,
    name: '视频',
  },
  image: {
    icon: <Pic />,
    name: '图片',
  },
  text: {
    icon: <AddText />,
    name: '文字',
  },
  shape: {
    icon: <GraphicDesign />,
    name: '形状',
  },
};

const ElementList = (props: any) => {
  const { listStyle, domRef, timelineState, data, scrollTop, setScrollTop } =
    props;

  const { handleSelectElement } = useElement();

  const { toggleHideElement } = useHideElement();

  const handleElement = useMainStore((store) => store.handleElement());

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  const isHidden = (handleElement: PPTElement | null) =>
    hiddenElementIdList.includes(handleElement?.id || '');

  const { deleteElement } = useDeleteElements();
  const handleDeleteElement = () => {
    deleteElement();
  };

  const { unlockElement, lockElement } = useLockElement();

  useEffect(() => {
    domRef.current.scrollTop = scrollTop;
    timelineState.current.setScrollTop(scrollTop);
  }, [scrollTop]);

  return (
    <div className={styles['container']}>
      <div className={styles['operate']}>
        <div>
          <Popconfirm
            title="删除元素"
            description="确定删除当前选中元素吗？"
            onConfirm={() => handleDeleteElement()}
          >
            <DeleteOutlined className={styles['icon']} />
          </Popconfirm>
        </div>
        <div
          onClick={() => {
            toggleHideElement(handleElement);
          }}
        >
          {!isHidden(handleElement) ? (
            <EyeOutlined className={styles['icon']} />
          ) : (
            <EyeInvisibleOutlined className={styles['icon']} />
          )}
        </div>
        <div>
          {handleElement?.lock ? (
            <Lock
              className={styles['icon']}
              onClick={(e) => {
                e.stopPropagation();
                unlockElement(handleElement);
              }}
            />
          ) : (
            <Unlock
              className={styles['icon']}
              onClick={(e) => {
                e.stopPropagation();
                lockElement(handleElement);
              }}
            />
          )}
        </div>
      </div>
      <div
        ref={domRef}
        onScroll={(e) => {
          const { scrollTop } = e.target as HTMLDivElement;
          setScrollTop(scrollTop);
        }}
        className={styles['timeline-list']}
        style={{ ...listStyle }}
      >
        {data.map((item: PPTElement & any) => {
          return (
            <div
              id={`item-${item.id}`}
              className={clsx({
                [styles['timeline-list-item']]: true,
                [styles['timeline-list-item-active']]: item.selected,
              })}
              key={item.id}
              onClick={(e) => handleSelectElement(e, item)}
            >
              <div className={styles['content']}>
                <div className={styles['icon']}>{NAME_MAP[item.name].icon}</div>
                <div className={styles['text']}>{NAME_MAP[item.name].name}</div>
              </div>

              <Flex gap={6} className={styles['item-operate']}>
                <div
                  className={styles['item-icon']}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHideElement(item);
                  }}
                >
                  {isHidden(item) ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </div>
                <div className={styles['item-icon']}>
                  {item.lock ? (
                    <Lock
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockElement(item);
                      }}
                    />
                  ) : (
                    <Unlock
                      onClick={(e) => {
                        e.stopPropagation();
                        lockElement(item);
                      }}
                    />
                  )}
                </div>
              </Flex>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementList;
