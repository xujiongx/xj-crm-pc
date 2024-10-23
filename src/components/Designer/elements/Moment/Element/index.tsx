import BaseApply, {
  ApplyElementProps,
} from '@/components/Designer/components/Element/Base';

const MomentApplyElement = (props: ApplyElementProps) => (
  <BaseApply
    hideStatus
    renderDeadline={(item) => `${item.pv}次播放`}
    {...props}
  />
);

export default MomentApplyElement;
