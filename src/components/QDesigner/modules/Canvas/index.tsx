import { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

const EditorCanvas = () => {
  const [dragState, setDragState] = useState({
    x: 100,
    y: 100,
  });

  return (
    <Draggable
      position={dragState}
      handle=".js_box"
      onStop={(e: DraggableEvent, data: DraggableData) => {
        setDragState({ x: data.x, y: data.y });
      }}
    >
      <div className="js_box">EditorCanvas</div>
    </Draggable>
  );
};

export default EditorCanvas;
