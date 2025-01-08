import Button from '../Button';
import { useRadioGroupContext } from '../RadioGroup/context';

type Props = {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: any;
};

const RadioButton: React.FC<Props> = ({
  value,
  disabled = false,
  children,
  className,
  style,
}) => {
  const { value: cValue, updateValue } = useRadioGroupContext();
  return (
    <Button
      style={style}
      className={className}
      checked={!disabled && cValue === value}
      disabled={disabled}
      type="radio"
      onClick={() => !disabled && updateValue(value)}
    >
      {children}
    </Button>
  );
};
export default RadioButton;
