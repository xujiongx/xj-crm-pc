import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Modal, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditableElement from './EditableElement';

import DIcon from '../../../components/Element/DIcon';
import useMainStore from '../../../store';
import styles from './index.less';

const Viewport = <T,>() => {
  const listRef = useRef<HTMLDivElement>(null);

  const preview = useMainStore((store) => store.preview);
  const viewConfig = useMainStore((store) => store.viewConfig);
  const elements = useMainStore((store) => store.elements);
  const selectedElement = useMainStore((store) => store.selectedElement);
  const selectedElementIndex = useMainStore((store) =>
    store.elements.findIndex((i) => i.id === store.selectedElement?.id),
  );

  const [selectionBox, setSelectionBox] = useState({
    y: 0,
    width: 0,
    height: 0,
  });

  const onSelect = (element: T) => {
    useMainStore.getState().setSelectedElement<T>(element);
  };

  useEffect(() => {
    if (selectedElement) {
      const node = listRef.current?.children?.[
        selectedElementIndex
      ] as HTMLElement;
      if (!node) return;
      const ro = new ResizeObserver((entries) => {
        entries.forEach(() => {
          setSelectionBox({
            y: node?.offsetTop || 0,
            width: node?.offsetWidth || 0,
            height: node?.offsetHeight || 0,
          });
        });
      });

      ro.observe(node);

      return () => {
        ro.disconnect();
      };
    } else {
      setSelectionBox({ y: 0, width: 0, height: 0 });
    }
  }, [selectedElement, elements]);

  const onDragEnd = ({ active, over, delta }: DragEndEvent) => {
    if (Math.abs(delta.y) && active.id !== over?.id) {
      const activeIndex = elements.findIndex(
        (i: { id: string }) => i.id === active.id,
      );
      const overIndex = elements.findIndex(
        (i: { id: string }) => i.id === over?.id,
      );
      useMainStore
        .getState()
        .setElements(arrayMove(elements, activeIndex, overIndex));
    }
  };

  console.log('data', { elements, viewConfig, selectedElement });

  return (
    <div className={styles.viewport} style={viewConfig.style}>
      <div className={styles.container} ref={listRef}>
        <DndContext
          modifiers={[restrictToVerticalAxis]}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          onDragMove={({ delta }) => {
            if (Math.abs(delta.y)) {
              useMainStore.getState().setSelectedElement(undefined);
            }
          }}
        >
          <SortableContext
            disabled={preview}
            items={elements.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {elements.map((item) => (
              <EditableElement
                key={item.id}
                element={item}
                onSelect={() => onSelect(item)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {!!selectionBox.width && (
        <div className={styles.auxtool}>
          <div
            className={styles['auxtool-selection']}
            style={{
              width: selectionBox.width,
              height: selectionBox.height,
              transform: `perspective(1px) translate3d(0px, ${selectionBox.y}px, 0px)`,
            }}
          >
            {preview ? null : (
              <div className={styles['auxtool-helpers']}>
                {selectedElementIndex !== 0 && (
                  <Tooltip title="向上移动" placement="right">
                    <div
                      className={styles['auxtool-item']}
                      onClick={() => {
                        useMainStore
                          .getState()
                          .onUpElement(selectedElementIndex);
                      }}
                    >
                      <DIcon type="icon-up" />
                    </div>
                  </Tooltip>
                )}
                {selectedElementIndex !== elements.length - 1 && (
                  <Tooltip title="向下移动" placement="right">
                    <div
                      className={styles['auxtool-item']}
                      onClick={() => {
                        useMainStore
                          .getState()
                          .onDownElement(selectedElementIndex);
                      }}
                    >
                      <DIcon type="icon-down" />
                    </div>
                  </Tooltip>
                )}
                <Tooltip title="复制" placement="right">
                  <div
                    className={styles['auxtool-item']}
                    onClick={() => {
                      useMainStore
                        .getState()
                        .onCopyElement(selectedElementIndex);
                    }}
                  >
                    <DIcon type="icon-copy" />
                  </div>
                </Tooltip>
                <Tooltip title="删除" placement="right">
                  <div
                    className={styles['auxtool-item']}
                    onClick={() => {
                      Modal.confirm({
                        title: '确认删除该组件吗？',
                        onOk: () => {
                          useMainStore
                            .getState()
                            .onDeleteElement(selectedElementIndex);
                        },
                      });
                    }}
                  >
                    <DIcon type="icon-delete" />
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewport;
