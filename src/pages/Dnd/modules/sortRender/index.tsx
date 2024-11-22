import { uid } from '@aicc/shared/es';
import { useState } from 'react';
import Box from './box';
import styles from './index.less';

const defaultArray = [
  {
    id: '1',
    value: '1',
  },
  {
    id: '2',
    value: '2',
  },
  {
    id: '3',
    value: '3',
  },
];

const swappedArray = (array, x, y) => {
  const newArray = [...array];
  const index1 = newArray.findIndex((item) => item.id === y.id);
  newArray.splice(index1, 1);
  const index2 = newArray.findIndex((item) => item.id === x.id);
  newArray.splice(index2, 0, y);
  return newArray;
};

const insetToArray = (array, x, y) => {
  const newArray = [...array];
  const index = newArray.findIndex((item) => item.id === y.id);
  if (index !== -1) {
    newArray.splice(index, 0, x);
  }
  return newArray;
};

const SortRender: React.FC = () => {
  const [array, setArray] = useState(defaultArray);

  const handleDrop = (x, y) => {
    if (y.id) {
      setArray((array) => swappedArray(array, x, y));
    } else {
      setArray((array) => insetToArray(array, { ...y, id: uid() }, x));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Box className={styles['item']} item={{ id: '', value: '4' }}></Box>
        <Box className={styles['item']} item={{ id: '', value: '5' }}></Box>
      </div>
      <div className={styles['list']}>
        {array.map((item) => (
          <Box
            key={item.id}
            className={styles['item']}
            item={item}
            handleDrop={handleDrop}
          ></Box>
        ))}
      </div>
    </div>
  );
};

export default SortRender;
