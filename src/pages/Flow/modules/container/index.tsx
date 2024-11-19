const ContainerRender = (props) => {
  const { containerRef } = props;

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <div id="container" ref={containerRef}></div>
    </div>
  );
};

export default ContainerRender;
