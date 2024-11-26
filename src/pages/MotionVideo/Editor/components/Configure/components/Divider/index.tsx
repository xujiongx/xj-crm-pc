import clsx from 'clsx'
import styles from './index.less';

type Props = { type?: 'horizontal' | 'vertical', margin?: number }
const Divider: React.FC<Props> = ({ type = 'horizontal', margin = 0 }) => {
  return (
    <div className={clsx(styles.divider, styles[type])}
      style={
        { margin: type === 'horizontal' ? `${margin || 24}px 0` : `0 ${margin || 8}px` }
      }
    ></div>
  )
}

export default Divider
