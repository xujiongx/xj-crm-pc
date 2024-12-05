const ANIMATION_MAP = {
  in: '入场动画',
  attention: '强调动画',
  out: '退场动画',
};

const ActionRender = (props) => {
  const { action, row } = props;
  if (action.effectId === 'animate') {
    return (
      <div
        style={{
          textAlign: 'center',
          lineHeight: '20px',
          color: '#fff',
          padding: '0 10px',
          overflow: 'hidden',
        }}
      >
        {ANIMATION_MAP[action.data.type]}
      </div>
    );
  }
  if (action.effectId === 'video') {
    return (
      <div
        style={{
          textAlign: 'center',
          lineHeight: '20px',
          color: '#fff',
          padding: '0 10px',
          overflow: 'hidden',
        }}
      >
        视频
      </div>
    );
  }
  return null;
};

export default ActionRender;
