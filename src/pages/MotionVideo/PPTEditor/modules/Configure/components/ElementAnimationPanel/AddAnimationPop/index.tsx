import { Tabs, TabsProps } from 'antd';
import AnimationList from '../AnimationList';
import styles from './index.less';
const AddAnimationPop = (props) => {
  const { tab = 'in', handleAddAnimation } = props;
  const items: TabsProps['items'] = [
    {
      key: 'in',
      label: '入场',
      children: (
        <AnimationList type="in" handleAddAnimation={handleAddAnimation} />
      ),
    },
    {
      key: 'attention',
      label: '强调',
      children: (
        <AnimationList
          type="attention"
          handleAddAnimation={handleAddAnimation}
        />
      ),
    },
    {
      key: 'out',
      label: '退场',
      children: (
        <AnimationList type="out" handleAddAnimation={handleAddAnimation} />
      ),
    },
  ];

  console.log('😍', tab);

  return (
    <Tabs
      className={styles['add-animation-pop']}
      defaultActiveKey={tab}
      items={items}
      centered
    />
  );
};

export default AddAnimationPop;
