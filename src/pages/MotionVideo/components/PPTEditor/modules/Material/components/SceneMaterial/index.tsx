import { VIEWPORT_SIZE } from '@/pages/MotionVideo/components/PPTEditor/hooks/useViewportSize';
import useMainStore from '@/pages/MotionVideo/components/PPTEditor/store/main';
import useSlidesStore from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import { SLIDE_ANIMATIONS_MAP } from '@/pages/MotionVideo/config';
import { SlideItem } from '@/pages/MotionVideo/interface';
import { uid } from '@aicc/shared';
import { PlusOutlined } from '@ant-design/icons';
import { Transform } from '@icon-park/react';
import { useSize } from 'ahooks';
import { Button } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { arrayMoveImmutable } from 'array-move';
import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { SortEnd } from 'react-sortable-hoc/types';
import useAddSlidesOrElements from '../../../../hooks/useAddSlidesOrElements';
import useHistorySnapshot from '../../../../hooks/useHistorySnapshot';
import ContextMenu from '../../../Canvas/components/ContextMenu';
import { ToolbarStates } from '../../../Configure/enum';
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
  const { slide, width, viewportRatio, slideIndex, index } = slideInfo;
  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  return (
    <div
      style={{
        width,
        height: width * viewportRatio,
      }}
      className={clsx(styles.slide, {
        [styles['slide-active']]: slideIndex === index,
      })}
    >
      <ScreenView
        scale={width / VIEWPORT_SIZE}
        ratio={viewportRatio}
        slide={slide}
        hiddenElementIdList={hiddenElementIdList}
      />
    </div>
  );
};

const DragHandle = SortableHandle((props: any) => <SingleSlide {...props} />);

const SortableSingleSlide = SortableElement(
  (props: { slideInfo: SlideListProps }) => {
    const {
      index,
      slides,
      updateSlideIndex,
      slide,
      CONTEXTMENU_Ele,
      slidesWrapper,
      contextMenuClickFn,
      hanldefocusFn,
    } = props.slideInfo;
    const setActiveConfigTab = useMainStore(
      (state) => state.setActiveConfigTab,
    );

    const handleTransferClick = useCallback(() => {
      updateSlideIndex(index);
      useMainStore.getState().setActiveElementIds([]);
      setTimeout(() => {
        setActiveConfigTab(ToolbarStates.SLIDE_ANIMATION);
      }, 10);
    }, [index, setActiveConfigTab, updateSlideIndex]);

    return (
      <div className={styles['sort-item']}>
        <DragHandle {...props} />
        <ContextMenu
          menuItems={CONTEXTMENU_Ele}
          targetEl={
            slidesWrapper.current?.childNodes?.[1].childNodes[
              index
            ] as HTMLDivElement
          }
          contextMenuClickFn={contextMenuClickFn}
          defaultAction={() => {
            hanldefocusFn(index);
          }}
        />
        {index !== slides.length - 1 && (
          <div className={styles['transfer']} onClick={handleTransferClick}>
            <Transform />
            <span className={styles['text']}>
              {slide.turningMode && slide.turningMode !== 'no'
                ? SLIDE_ANIMATIONS_MAP[slide.turningMode]
                : '添加转场'}
            </span>
          </div>
        )}
      </div>
    );
  },
);

const SortableBody = SortableContainer(({ children }: any) => {
  return <div>{children}</div>;
});

const SceneMaterial = () => {
  const sizeRef = useRef<HTMLDivElement>(null);
  const slidesWrapper = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(sizeRef) || {};
  const slides = useSlidesStore((state) => state.slides);
  const addSlide = useSlidesStore((state) => state.addSlide);
  const updateSlideIndex = useSlidesStore((state) => state.updateSlideIndex);
  const slideIndex = useSlidesStore((state) => state.slideIndex);
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const deleteSlide = useSlidesStore((state) => state.deleteSlide);
  const setSlides = useSlidesStore((state) => state.setSlides);
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const setThumbnailsFocus = useMainStore((store) => store.setThumbnailsFocus);
  const { addSlidesFromData } = useAddSlidesOrElements();
  const { addHistorySnapshot } = useHistorySnapshot();

  const createNew = useCallback(() => {
    addSlide({
      id: uid(),
      elements: [],
      background: {
        type: 'solid',
        color: '#fff',
      },
    });
    addHistorySnapshot();
  }, [addSlide, addHistorySnapshot]);

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

  const hanldefocusFn = useCallback(
    (index: number) => {
      updateSlideIndex(index);
      useMainStore.getState().setActiveElementIds([]);
      setThumbnailsFocus(true);
    },
    [setThumbnailsFocus, updateSlideIndex],
  );

  const contextMenuClickFn = {
    copy: useCallback(() => {
      const slide = JSON.parse(JSON.stringify(currentSlide()));
      addSlidesFromData([slide]);
    }, [addSlidesFromData, currentSlide]),
    delete: useCallback(() => {
      deleteSlide(currentSlide().id);
      addHistorySnapshot();
    }, [addHistorySnapshot, currentSlide, deleteSlide, updateSlideIndex]),
  };

  const slideDragEnd = useCallback(
    ({ oldIndex, newIndex }: SortEnd) => {
      if (
        oldIndex === newIndex ||
        !Number.isInteger(oldIndex) ||
        !Number.isInteger(newIndex)
      )
        return;

      const _slides = JSON.parse(JSON.stringify(slides));
      const newData: any = arrayMoveImmutable(_slides, oldIndex, newIndex);

      setSlides(newData);
      updateSlideIndex(newIndex);
      useMainStore.getState().setActiveElementIds([]);
      addHistorySnapshot();
      setThumbnailsFocus(true);
    },
    [
      addHistorySnapshot,
      setSlides,
      setThumbnailsFocus,
      slides,
      updateSlideIndex,
    ],
  );

  return (
    <div className={styles['slide-wrapper']}>
      <div className={styles.add}>
        <Button type="dashed" block icon={<PlusOutlined />} onClick={createNew}>
          新建空白场景
        </Button>
      </div>

      <div className={styles.slides} ref={slidesWrapper}>
        <div style={{ width: '100%' }} ref={sizeRef} />
        <SortableBody
          onSortEnd={slideDragEnd}
          onSortStart={(indexObj: any) => {
            hanldefocusFn(indexObj.index);
          }}
          useDragHandle
          helperClass="row-dragging"
        >
          {slides.map((slide: SlideItem, index: number) => (
            <SortableSingleSlide
              key={slide.id}
              index={index}
              slideInfo={{
                width,
                slide,
                index,
                slideIndex,
                viewportRatio,
                updateSlideIndex,
                CONTEXTMENU_Ele,
                slidesWrapper,
                contextMenuClickFn,
                hanldefocusFn,
                slides,
              }}
            />
          ))}
        </SortableBody>
      </div>
    </div>
  );
};

export default SceneMaterial;
