import useDeleteElements from '@/pages/MotionVideo/PPTEditor/hooks/useDeleteElements';
import useDragElement from '@/pages/MotionVideo/PPTEditor/hooks/useDragElement';
import useHideElement from '@/pages/MotionVideo/PPTEditor/hooks/useHideElement';
import useSelectElement from '@/pages/MotionVideo/PPTEditor/hooks/useSelectElement';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import clsx from 'clsx';
import styles from './index.less';

const NAME_MAP = {
  video: {
    icon: <VideoCameraOutlined />,
    name: '视频',
  },
  image: {
    icon: <FileImageOutlined />,
    name: '图片',
  },
  text: {
    icon: <FontSizeOutlined />,
    name: '文字',
  },
};

const ElementList = (props: any) => {
  const { listStyle, domRef, timelineState, data } = props;

  const currentSlide = useSlidesStore((state) => state.currentSlide);

  const { drag } = useDragElement(currentSlide()?.elements);

  const { select } = useSelectElement(currentSlide()?.elements, drag);

  const handleSelectElement = (e, item) => {
    select(e, item, false);
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
        <div
          onClick={() => {
            toggleHideElement(handleElementId);
          }}
          className={clsx({
            [styles['active']]: isHidden,
          })}
        >
          {!isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </div>
        <div>
          <Popconfirm
            title="删除元素"
            description="确定删除当前选中元素吗？"
            onConfirm={() => handleDeleteElement()}
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
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
              <div className={styles['icon']}>{NAME_MAP[item.name].icon}</div>
              <div className={styles['text']}>
                {NAME_MAP[item.name].name}
                <span>
                  {/* <IconFont
                    type="icon-user"
                    onClick={() => {
                      toggleHideElement(item.id);
                    }}
                  /> */}
                  {/* {hiddenElementIdList.includes(item.id) ? '显示' : '隐藏'} */}
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
