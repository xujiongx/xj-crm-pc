import { useState } from 'react';

export function Observe(receive) {
  const [randPos, setRandPos] = useState([0, 0]);
  function moveKnight(toX, toY) {
    setRandPos([toX, toY]);
  }
  function canMoveKnight(toX, toY) {
    const [x, y] = randPos;
    const dx = toX - x;
    const dy = toY - y;

    return (
      (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
      (Math.abs(dx) === 1 && Math.abs(dy) === 2)
    );
  }

  const action = {
    moveKnight,
    canMoveKnight,
  };
  // useInterval(
  //   () => {
  //     setRandPos([
  //       Math.floor(Math.random() * 8),
  //       Math.floor(Math.random() * 8),
  //     ]);
  //   },
  //   500,
  //   {},
  // );

  return receive(randPos, action);
}
