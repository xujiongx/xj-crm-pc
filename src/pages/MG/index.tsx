import styles from './index.less';
import TimelineEditor from './modules/timeline'

const Page = () => {
  return (
    <div className={styles['page']}>
      MG动画编辑器
      <TimelineEditor />
    </div>
  );
};

export default Page;
