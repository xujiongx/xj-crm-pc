import useStore from '../../store';

const ConfigRender = () => {
  const { currentNode } = useStore();
  console.log('💁‍♂️', currentNode?.getData(), currentNode?.shape);

  return <div>config</div>;
};

export default ConfigRender;
