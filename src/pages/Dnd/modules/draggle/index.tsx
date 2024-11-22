import Draggable from 'react-draggable';

const DraggableDemo = () => {
  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        position: 'relative',
        background: '#ccc',
        overflow: 'hidden',
      }}
    >
      <Draggable disabled={false} scale={2} handle=".handle">
        <div>
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableDemo;
