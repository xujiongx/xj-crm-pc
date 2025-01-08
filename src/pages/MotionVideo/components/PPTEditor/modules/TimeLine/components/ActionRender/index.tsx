import useMainStore from '@/pages/MotionVideo/components/PPTEditor/store/main';

const ANIMATION_MAP: Record<string, string> = {
  in: '入场动画',
  attention: '强调动画',
  out: '退场动画',
};

const ActionRender = (props) => {
  const { action, row } = props;
  const activeActionId = useMainStore((state) => state.activeActionId);

  const isActive = action.id === activeActionId;

  if (action.effectId === 'animate') {
    return (
      <div
        style={{
          textAlign: 'center',
          lineHeight: '20px',
          color: '#fff',
          padding: '0 10px',
          overflow: 'hidden',
          backgroundColor: isActive ? '#568DFE' : '',
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
          backgroundColor: isActive ? '#568DFE' : '',
        }}
      >
        视频
      </div>
    );
  }
  return null;
};

export default ActionRender;
