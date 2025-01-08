import { FC } from 'react';
import { RenderLeafProps } from 'slate-react';

const LeafText: FC<RenderLeafProps> = (props) => {
  const { attributes, children } = props;
  return (
    <span
      style={{
        padding: '0 0.1px',
      }}
      {...attributes}
    >
      {children}
    </span>
  );
};

export default LeafText;
