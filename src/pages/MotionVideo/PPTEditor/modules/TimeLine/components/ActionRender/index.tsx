const ActionRender = (props) => {
  const { action, row } = props;
  if (action.effectId === 'animate') {
    return (
      <div style={{ textAlign: 'center', lineHeight: '20px' }}>
        {action.data.type}
      </div>
    );
  }
  return null;
};

export default ActionRender;
