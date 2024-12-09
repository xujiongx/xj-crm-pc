import { VIEWPORT_SIZE } from '@/pages/MotionVideo/PPTEditor/hooks/useViewportSize';
import { SlideItem } from '@/pages/MotionVideo/PPTEditor/interface';
import useMainStore from '@/pages/MotionVideo/PPTEditor/store/main';
import useSlidesStore from '@/pages/MotionVideo/PPTEditor/store/slides';
import emitter, {
  EmitterEvents,
} from '@/pages/MotionVideo/PPTEditor/utils/emitter';
import { uid } from '@aicc/shared';
import { PlusOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Button } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import clsx from 'clsx';
import { useRef } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { SortEnd } from 'react-sortable-hoc/types';
import useAddSlidesOrElements from '../../../../hooks/useAddSlidesOrElements';
import snapshotStore from '../../../../store/snapshot';
import ContextMenu from '../../../Canvas/components/ContextMenu';
import ScreenView from './ScreenView';
import styles from './index.less';

type SlideInfo = {
  slide: SlideItem;
  width: number;
  viewportRatio: number;
  slideIndex: number;
  index: number;
  updateSlideIndex: (index: number) => void;
  CONTEXTMENU_Ele: ItemType[];
  slidesWrapper: React.RefObject<HTMLDivElement>;
  contextMenuClickFn: any;
  hanldefocusFn: (index: number) => void;
};

interface SlideListProps extends SlideInfo {
  slides: SlideItem[];
}

const SingleSlide = ({ slideInfo }: { slideInfo: SlideInfo }) => {
  let {
    slide,
    width,
    viewportRatio,
    slideIndex,
    index,
    updateSlideIndex,
    CONTEXTMENU_Ele,
    slidesWrapper,
    contextMenuClickFn,
    hanldefocusFn,
  } = slideInfo;

  return (
    <div
      style={{
        width,
        height: width * viewportRatio,
      }}
      className={clsx(styles.slide, {
        [styles['slide-active']]: slideIndex === index,
      })}
      onClick={() => {
        updateSlideIndex(index);
        emitter.emit(EmitterEvents.SET_TIMELINE_TIME, 0);
        // 重置时间轴时间
      }}
    >
      <ScreenView
        scale={width / VIEWPORT_SIZE}
        ratio={viewportRatio}
        slide={slide}
      />
      <ContextMenu
        MenuItem={CONTEXTMENU_Ele}
        targetEl={
          slidesWrapper.current?.childNodes?.[1].childNodes[
            index
          ] as HTMLDivElement
        }
        contextMenuClickFn={contextMenuClickFn}
        defaultAction={() => {
          hanldefocusFn(index);
        }}
      ></ContextMenu>
    </div>
  );
};

const SortableSingleSlide = SortableElement(SingleSlide);

const SlideList = (props: SlideListProps) => {
  return (
    <div>
      {props.slides.map((slide: SlideItem, index: number) => (
        <SortableSingleSlide
          key={slide.id}
          index={index}
          slideInfo={{ ...props, slide, index }}
        />
      ))}
    </div>
  );
};

const SortableSlideList = SortableContainer<any>((props) => (
  <SlideList {...props} />
));

const SceneMaterial = () => {
  const sizeRef = useRef<HTMLDivElement>(null);
  const slidesWrapper = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(sizeRef) || {};
  const {
    slides,
    slideIndex,
    addSlide,
    updateSlideIndex,
    currentSlide,
    deleteSlide,
    setSlides,
  } = useSlidesStore((state) => state);
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const { addSlidesFromData } = useAddSlidesOrElements();
  const addHistorySnapshot = snapshotStore((state) => state.add);

  const createNew = () =>
    addSlide({
      id: uid(),
      elements: [],
      background: {
        type: 'solid',
        color: '#fff',
      },
    });

  const CONTEXTMENU_Ele = [
    {
      key: 'copy',
      label: '复制',
    },
    {
      key: 'delete',
      label: '删除',
    },
  ];

  const hanldefocusFn = function (index: number) {
    updateSlideIndex(index);
  };

  const contextMenuClickFn = {
    // 将当前页复制一份到下一页
    copy: function () {
      const slide = JSON.parse(JSON.stringify(currentSlide()));
      addSlidesFromData([slide]);
    },
    delete: function () {
      deleteSlide(currentSlide().id);
      updateSlideIndex(-1);
      addHistorySnapshot();
    },
  };

  const slideDragEnd = function ({ oldIndex, newIndex }: SortEnd) {
    if (
      oldIndex === newIndex ||
      !Number.isInteger(oldIndex) ||
      !Number.isInteger(newIndex)
    )
      return;

    const _slides = JSON.parse(JSON.stringify(slides));
    const _slide = _slides[oldIndex];
    _slides.splice(oldIndex, 1);
    _slides.splice(newIndex, 0, _slide);
    setSlides(_slides);
    updateSlideIndex(newIndex);
  };

  return (
    <div className={styles['slide-wrapper']}>
      <div className={styles.add}>
        <Button type="dashed" block icon={<PlusOutlined />} onClick={createNew}>
          新建空白场景
        </Button>
      </div>

      <div className={styles.slides} ref={slidesWrapper}>
        <div style={{ width: '100%' }} ref={sizeRef} />
        <SortableSlideList
          onSortEnd={slideDragEnd}
          distance={10}
          slides={slides}
          width={width}
          viewportRatio={viewportRatio}
          slideIndex={slideIndex}
          updateSlideIndex={updateSlideIndex}
          CONTEXTMENU_Ele={CONTEXTMENU_Ele}
          slidesWrapper={slidesWrapper}
          contextMenuClickFn={contextMenuClickFn}
          hanldefocusFn={hanldefocusFn}
        />
      </div>
    </div>
  );
};

export default SceneMaterial;
