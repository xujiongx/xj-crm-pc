import { digitalImageList } from './const';
import ImageGroup from './ImageGroup';

const RobotListMaterial = () => {
  const handleChange = (v) => {
    console.log('😘', v);
  };
  return <ImageGroup options={digitalImageList} onChange={handleChange} />;
};

export default RobotListMaterial;
