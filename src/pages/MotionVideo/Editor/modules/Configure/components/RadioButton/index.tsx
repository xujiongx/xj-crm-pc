import Button from '../Button'

type Props = {
  value: string
  disabled?: boolean
  children?: React.ReactNode
  className?: string
  style?: any
}

const RadioButton: React.FC<Props> = ({ value, disabled = false, children, className, style }) => {
  const updateValue = (value: string) => value

  return (
    <Button
      style={style}
      className={className}
      checked={!disabled && '_value' === value}
      disabled={disabled}
      type="radio"
      clickEvent={() => !disabled && updateValue(value)}
    >
      {children}
    </Button>
  )
}
export default RadioButton
