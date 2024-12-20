import ApplyConfigure from '@/components/Designer/components/Configure/Base';

interface ApplyConfigureProps {
  showCover?: boolean;
}
const CourseApplyConfig = (props: ApplyConfigureProps) => (
  <ApplyConfigure {...props} />
);

export default CourseApplyConfig;
