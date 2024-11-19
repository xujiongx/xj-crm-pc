/**
 * 单个元素
 * @param props
 * @returns
 */
const ElementItem = (props) => {
  const { item, graph, dnd } = props;

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const node = graph.createNode(item);
    dnd.start(node, e.nativeEvent);
  };

  return (
    <div
      style={{
        width: '100px',
        height: '50px',
        background: 'red',
        cursor: 'move',
        marginBottom: '10px',
      }}
      onMouseDown={startDrag}
    >
      <span>{item.shape}</span>
    </div>
  );
};

export default ElementItem;
