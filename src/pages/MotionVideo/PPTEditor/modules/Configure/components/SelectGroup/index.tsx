import clsx from "clsx"
import styles from './index.less'

type Props = {
  children?: React.ReactNode
  className?: string
}

const SelectGroup: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={clsx(styles['select-group'], className)}>
      {children}
    </div>
  )
}

export default SelectGroup
