import BaseApply, {
  ApplyElementProps,
} from '@/components/Designer/components/Element/Base';

const ProgramApplyElement = (props: ApplyElementProps) => (
  <BaseApply
    {...props}
    statusMap={{
      0: '未开始',
      1: '未通关',
      2: '已结束',
      3: '已通关',
    }}
  />
);

export default ProgramApplyElement;
