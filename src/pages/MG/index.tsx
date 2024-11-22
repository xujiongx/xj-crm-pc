import styles from './index.less';

import { Timeline } from '@xzdarcy/react-timeline-editor';
const Page = () => {
  return (
    <div className={styles['page']}>
      MG动画编辑器
      <Timeline editorData={[]} effects={{}} />
    </div>
  );
};

export default Page;
