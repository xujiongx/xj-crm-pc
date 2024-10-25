import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardSquare from '../borderSquare';
import Knight from '../knight';

function renderSquare(i, [knightX, knightY], action) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function renderPiece(x, y, [knightX, knightY]) {
    if (x === knightX && y === knightY) {
      return <Knight />;
    }
  }

  return (
    <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
      <BoardSquare x={x} y={y} action={action}>
        {renderPiece(x, y, [knightX, knightY])}
      </BoardSquare>
    </div>
  );
}

export default function Board({ knightPosition, action }) {
  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition, action));
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {squares}
      </div>
    </DndProvider>
  );
}
