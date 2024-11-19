import { Node } from '@antv/x6';
import { list } from './const';
import ElementItem from './item';

export type ElementType = Node.Metadata;

const Elements = (props) => {
  const { dnd, graph } = props;
  return (
    <div>
      <h1>Elements</h1>
      {list.map((item) => (
        <ElementItem key={item.id} item={item} dnd={dnd} graph={graph} />
      ))}
    </div>
  );
};

export default Elements;
