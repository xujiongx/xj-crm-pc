import { debounce, throttle } from 'lodash';
import useSnapshotStore from '../store/snapshot';

const useHistorySnapshot = () => {
  const snapshotStore = useSnapshotStore();

  // 添加历史快照(历史记录)
  const add = debounce(
    function () {
      snapshotStore.add();
    },
    300,
    { trailing: true },
  );

  // 重做
  const redo = throttle(
    function () {
      snapshotStore.redo();
    },
    100,
    { leading: true, trailing: false },
  );

  // 撤销
  const undo = throttle(
    function () {
      snapshotStore.undo();
    },
    100,
    { leading: true, trailing: false },
  );

  return {
    add,
    redo,
    undo,
  };
};

export default useHistorySnapshot;
