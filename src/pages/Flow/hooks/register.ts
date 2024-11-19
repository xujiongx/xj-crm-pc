import { register } from '@antv/x6-react-shape';
import Demo from '../components/Demo';

export const useRegister = () => {
  register({
    shape: 'demo',
    width: 200,
    height: 100,
    component: Demo,
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              magnet: true,
              stroke: '#8f8f8f',
              r: 5,
            },
          },
        },
      },
    },
  });
};
