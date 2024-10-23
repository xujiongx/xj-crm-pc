import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ElementType } from '../../../../interface';
import DecoratorElement from './Decorator';

interface EditableElementProps {
  disabled?: boolean;
  style?: React.CSSProperties;
  element: ElementType;
  onSelect: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: ElementType,
  ) => void;
}

const EditableElement = ({
  element,
  onSelect,
  ...rest
}: EditableElementProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
  });

  const style: React.CSSProperties = {
    ...rest.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 999, opacity: 0.9 } : {}),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        onPointerDown={(e) => {
          listeners?.onPointerDown(e);
          onSelect(e, element);
        }}
      >
        <DecoratorElement element={element} />
      </div>
    </div>
  );
};

export default EditableElement;
