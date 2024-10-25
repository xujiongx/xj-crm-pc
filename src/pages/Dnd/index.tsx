import Board from './components/board';
import { Observe } from './components/game';

const Page: React.FC = () => {
  return (
    <div
      style={{
        width: '400px',
        height: '400px',
      }}
    >
      {Observe((knightPosition, action) => (
        <Board knightPosition={knightPosition} action={action} />
      ))}
    </div>
  );
};

export default Page;
