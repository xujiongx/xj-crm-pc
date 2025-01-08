import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useControllableValue } from 'ahooks';
import { Table } from 'antd';
import { ColumnType, TableProps } from 'antd/es/table';
import SortableItem from './item';

interface DndTableProps<T> extends TableProps<T> {
  disableSort?: boolean;
  rowKey?: string;
  columns?: Array<ColumnType<T>>;
  onSortEnd?: (data: Array<T>, activeIndex: number, overIndex: number) => void;
}

const DndTable = <T extends Record<string, any>>({
  disableSort = false,
  rowKey = 'id',
  columns = [],
  components,
  ...rest
}: DndTableProps<T>) => {
  const [dataSource = [], setDataSource] = useControllableValue<T[]>(rest, {
    valuePropName: 'dataSource',
    trigger: 'onSortEnd',
  });

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id && active.id !== over?.id) {
      const activeIndex = dataSource.findIndex(
        (i) => String(i[rowKey]) === active.id,
      );
      const overIndex = dataSource.findIndex(
        (i) => String(i[rowKey]) === over?.id,
      );
      setDataSource(
        arrayMove(dataSource, activeIndex, overIndex),
        activeIndex,
        overIndex,
      );
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={dataSource.map((c) => String(c[rowKey]))}
        strategy={verticalListSortingStrategy}
      >
        <Table
          {...rest}
          rowKey={rowKey}
          dataSource={dataSource}
          columns={
            disableSort
              ? columns
              : columns.find((c) => c.dataIndex === 'sort')
                ? columns
                : [
                    {
                      title: '排序',
                      dataIndex: 'sort',
                      width: rest.size === 'small' ? 56 : 66,
                      align: 'center',
                    },
                    ...columns,
                  ]
          }
          pagination={false}
          components={{
            body: { ...(components?.body || {}), row: SortableItem },
          }}
          scroll={{}}
        />
      </SortableContext>
    </DndContext>
  );
};

export default DndTable;
