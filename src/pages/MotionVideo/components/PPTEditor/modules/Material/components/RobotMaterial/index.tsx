import useCreateElement from '../../../../hooks/useCreateElement';
import { VIEWPORT_SIZE } from '../../../../hooks/useViewportSize';
import { useMainStore } from '../../../../store';
import { digitalImageList } from './const';
import ImageGroup from './ImageGroup';

const RobotListMaterial = () => {
  const { createDigitalRobotElement } = useCreateElement();
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const handleChange = (v, option) => {
    createDigitalRobotElement(
      {
        width: 150,
        height: 240,
        left: (VIEWPORT_SIZE - 150) / 2,
        top: (VIEWPORT_SIZE * viewportRatio - 240) / 2,
      },
      {
        digitalRobotId: v,
        src: option.url,
      },
    );
  };
  return <ImageGroup options={digitalImageList} onChange={handleChange} />;
};

export default RobotListMaterial;
