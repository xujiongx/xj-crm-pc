import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from 'react-virtualized';
import { TimelineRow } from '../../interface/action';
import { CommonProp } from '../../interface/common_prop';
import { EditData } from '../../interface/timeline';
import { prefix } from '../../utils/deal_class_prefix';
import { parserTimeToPixel } from '../../utils/deal_data';
import { DragLines } from './drag_lines';
import './edit_area.less';
import { EditRow } from './edit_row';
import { useDragLine } from './hooks/use_drag_line';

export type EditAreaProps = CommonProp & {
  /** 距离左侧滚动距离 */
  scrollLeft: number;
  /** 距离顶部滚动距离 */
  scrollTop: number;
  /** 滚动回调，用于同步滚动 */
  onScroll: (params: OnScrollParams) => void;
  /** 设置编辑器数据 */
  setEditorData: (params: TimelineRow[]) => void;
  /** 设置scroll left */
  deltaScrollLeft: (scrollLeft: number) => void;
};

/** edit area ref数据 */
export interface EditAreaState {
  domRef: React.MutableRefObject<HTMLDivElement>;
}

export const EditArea = React.forwardRef<EditAreaState, EditAreaProps>(
  (props, ref) => {
    const {
      editorData,
      rowHeight,
      scaleWidth,
      scaleCount,
      startLeft,
      scrollLeft,
      scrollTop,
      scale,
      hideCursor,
      cursorTime,
      onScroll,
      dragLine,
      getAssistDragLineActionIds,
      onActionMoveEnd,
      onActionMoveStart,
      onActionMoving,
      onActionResizeEnd,
      onActionResizeStart,
      onActionResizing,
    } = props;
    const {
      dragLineData,
      initDragLine,
      updateDragLine,
      disposeDragLine,
      defaultGetAssistPosition,
      defaultGetMovePosition,
    } = useDragLine();
    const editAreaRef = useRef<HTMLDivElement>();
    const gridRef = useRef<Grid>();
    const heightRef = useRef(-1);

    // ref 数据
    useImperativeHandle(ref, () => ({
      get domRef() {
        return editAreaRef;
      },
    }));

    const handleInitDragLine: EditData['onActionMoveStart'] = (data) => {
      if (dragLine) {
        const assistActionIds =
          getAssistDragLineActionIds &&
          getAssistDragLineActionIds({
            action: data.action,
            row: data.row,
            editorData,
          });
        const cursorLeft = parserTimeToPixel(cursorTime, {
          scaleWidth,
          scale,
          startLeft,
        });
        const assistPositions = defaultGetAssistPosition({
          editorData,
          assistActionIds,
          action: data.action,
          row: data.row,
          scale,
          scaleWidth,
          startLeft,
          hideCursor,
          cursorLeft,
        });
        initDragLine({ assistPositions });
      }
    };

    const handleUpdateDragLine: EditData['onActionMoving'] = (data) => {
      if (dragLine) {
        const movePositions = defaultGetMovePosition({
          ...data,
          startLeft,
          scaleWidth,
          scale,
        });
        updateDragLine({ movePositions });
      }
    };

    /** 获取每个cell渲染内容 */
    const cellRenderer: GridCellRenderer = ({ rowIndex, key, style }) => {
      const row = editorData[rowIndex]; // 行数据
      return (
        <EditRow
          {...props}
          style={{
            ...style,
            backgroundPositionX: `0, ${startLeft}px`,
            backgroundSize: `${startLeft}px, ${scaleWidth}px`,
          }}
          areaRef={editAreaRef}
          key={key}
          rowHeight={row?.rowHeight || rowHeight}
          rowData={row}
          dragLineData={dragLineData}
          onActionMoveStart={(data) => {
            handleInitDragLine(data);
            return onActionMoveStart && onActionMoveStart(data);
          }}
          onActionResizeStart={(data) => {
            handleInitDragLine(data);

            return onActionResizeStart && onActionResizeStart(data);
          }}
          onActionMoving={(data) => {
            handleUpdateDragLine(data);
            return onActionMoving && onActionMoving(data);
          }}
          onActionResizing={(data) => {
            handleUpdateDragLine(data);
            return onActionResizing && onActionResizing(data);
          }}
          onActionResizeEnd={(data) => {
            disposeDragLine();
            return onActionResizeEnd && onActionResizeEnd(data);
          }}
          onActionMoveEnd={(data) => {
            disposeDragLine();
            return onActionMoveEnd && onActionMoveEnd(data);
          }}
        />
      );
    };

    useLayoutEffect(() => {
      gridRef.current?.scrollToPosition({ scrollTop, scrollLeft });
    }, [scrollTop, scrollLeft]);

    useEffect(() => {
      gridRef.current.recomputeGridSize();
    }, [editorData]);

    console.log('👇', 22);

    return (
      <div ref={editAreaRef} className={prefix('edit-area')}>
        <AutoSizer>
          {({ width, height }) => {
            // 获取全部高度
            let totalHeight = 0;
            // 高度列表
            const heights = editorData.map((row) => {
              const itemHeight = row.rowHeight || rowHeight;
              totalHeight += itemHeight;
              return itemHeight;
            });
            if (totalHeight < height) {
              heights.push(height - totalHeight);
              if (heightRef.current !== height && heightRef.current >= 0) {
                setTimeout(() =>
                  gridRef.current?.recomputeGridSize({
                    rowIndex: heights.length - 1,
                  }),
                );
              }
            }
            heightRef.current = height;

            return (
              <Grid
                columnCount={1}
                rowCount={heights.length}
                ref={gridRef}
                cellRenderer={cellRenderer}
                columnWidth={Math.max(
                  scaleCount * scaleWidth + startLeft,
                  width,
                )}
                width={width}
                height={height}
                rowHeight={({ index }) => heights[index] || rowHeight}
                overscanRowCount={10}
                overscanColumnCount={0}
                onScroll={(param) => {
                  console.log('😮', 222, param);
                  onScroll(param);
                }}
              />
            );
          }}
        </AutoSizer>
        {dragLine && <DragLines scrollLeft={scrollLeft} {...dragLineData} />}
      </div>
    );
  },
);
