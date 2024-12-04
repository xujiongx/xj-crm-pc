import { ElementTypes, PPTElement } from '../../../../../../interface';
import TextView from '../../../../../../components/Element/Text/view';

interface ViewElementProps {
  zIndex: number;
  element: PPTElement;
}

const ElementTypeMap = {
  [ElementTypes.TEXT]: TextView,
};

const ViewElement = ({ element, zIndex }: ViewElementProps) => {
  const Component = ElementTypeMap[element.type];

  return (
    <div id={`view-element-${element.id}`} style={{ zIndex }}>
      <Component element={element} />
    </div>
  );
};

export default ViewElement;
