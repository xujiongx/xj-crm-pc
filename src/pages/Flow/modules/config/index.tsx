import useGraphStore from '../../store';

const ConfigRender = () => {
  const currentNodes = useGraphStore((state) => state.currentNodes);
  const currentNode = currentNodes[0];
  if (!currentNode) return null;
  console.log('💁‍♂️', currentNode.getData(), currentNode.shape);

  return <div>config</div>;
};

export default ConfigRender;
