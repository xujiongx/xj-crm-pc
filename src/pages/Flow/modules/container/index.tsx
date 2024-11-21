const ContainerRender = (props) => {
  const { containerRef } = props;

  const hanKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log('👨‍👩‍👧‍👦', e.key);
  };

  return (
    <div onKeyDown={hanKeyDown} style={{ width: '100%', height: '600px' }}>
      <div id="container" ref={containerRef}></div>
    </div>
  );
};

export default ContainerRender;
