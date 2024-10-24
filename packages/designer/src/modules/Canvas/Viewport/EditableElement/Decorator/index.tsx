import TitleElement from '../../../../../elements/Title/Element';
import { ElementType } from '../../../../../interface';
import useMainStore from '../../../../../store';

interface DecoratorElementProps {
  style?: React.CSSProperties;
  element: ElementType;
}

const DecoratorElement = ({ style, element }: DecoratorElementProps) => {
  const ElementTypeMap = useMainStore((store) => store.config.elementsMap);
  const Component = ElementTypeMap[element.component];

  const margins = (element['decorator-props']?.style?.margin as string)?.split(
    ' ',
  );
  const number = parseInt(margins[1]) + parseInt(margins[3]);

  return (
    <div
      style={{
        verticalAlign: 'top',
        overflow: 'hidden',
        display: 'inline-block',
        width: number ? `calc(100% - ${number}px)` : '100%',
        ...style,
        ...element['decorator-props']?.style,
      }}
    >
      {element['decorator-props']?.title?.visible ? (
        <TitleElement config={element['decorator-props']?.title} />
      ) : null}
      {Component ? (
        <Component
          config={element['component-props'] as any}
          decorator={element['decorator-props']}
          showTitle={element['decorator-props']?.title?.visible}
        />
      ) : null}
    </div>
  );
};

export default DecoratorElement;
