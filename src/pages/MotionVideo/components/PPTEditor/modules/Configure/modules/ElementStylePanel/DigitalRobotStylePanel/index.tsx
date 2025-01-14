import { Divider } from 'antd';
import ElementShadow from '../../../components/common/ElementShadow';
import ElementFlip from '../../../components/common/ElementFlip'
import ElementFilter from '../../../components/common/ElementFilter'

const DigitalRobotStylePanel = () => {
  return (
    <div>
      <ElementFlip />
      <Divider />
      <ElementFilter />
      <Divider />
      <ElementShadow />
    </div>
  );
};

export default DigitalRobotStylePanel;
