// import Cheers from "./modules/cheers"
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SortRender from './modules/sortRender';

const Page: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* <Cheers /> */}
      <SortRender />
    </DndProvider>
  );
};

export default Page;
