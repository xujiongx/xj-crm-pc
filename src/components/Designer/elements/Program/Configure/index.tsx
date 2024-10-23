import ApplyConfigure from '@/components/Designer/components/Configure/Base';
interface ApplyConfigureProps {
  showCover?: boolean;
}
const ApplyConfig = (props: ApplyConfigureProps) => (
  <ApplyConfigure {...props} />
);

export default ApplyConfig;
