import { Button, Tooltip } from 'antd';

interface ActionIconProps {
  icon: React.ReactNode;
  tooltip?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const ActionIcon = ({ icon, tooltip, ...rest }: ActionIconProps) => {
  return (
    <Button
      {...rest}
      icon={tooltip ? <Tooltip title={tooltip}>{icon}</Tooltip> : icon}
      size="small"
      type="text"
    />
  );
};

export default ActionIcon;
