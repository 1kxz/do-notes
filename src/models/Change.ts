import ItemData from './ItemData';

interface Added {
  newIndex: number;
  element: ItemData;
}
interface Removed {
  oldIndex: number;
  element: ItemData;
}

interface Moved {
  newIndex: number;
  oldIndex: number;
  element: ItemData;
}

export default interface Change {
  added?: Added;
  removed?: Removed;
  moved?: Moved;
}
