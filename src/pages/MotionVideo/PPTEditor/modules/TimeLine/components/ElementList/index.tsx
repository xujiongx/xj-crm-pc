import useDeleteElements from '@/pages/MotionVideo/PPTEditor/hooks/useDeleteElements';
import useHideElement from '@/pages/MotionVideo/PPTEditor/hooks/useHideElement';
import { useMainStore } from '@/pages/MotionVideo/PPTEditor/store';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileImageOutlined,
  FontSizeOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import clsx from 'clsx';
import { useElement } from '../../hooks';
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

  const { handleSelectElement } = useElement();

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
              <div className={styles['text']}>{NAME_MAP[item.name].name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementList;
