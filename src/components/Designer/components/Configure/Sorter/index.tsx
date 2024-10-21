import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';

interface SorterProps {
  items: Array<string>;
  children: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
}

const Sorter = ({ items, children, onDragEnd }: SorterProps) => (
  <DndContext
    modifiers={[restrictToVerticalAxis]}
    collisionDetection={closestCenter}
    onDragEnd={onDragEnd}
  >
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  </DndContext>
);

export default Sorter;
