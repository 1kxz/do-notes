import Item from './Item';

interface Added {
  newIndex: number;
  element: Item;
}
interface Removed {
  oldIndex: number;
  element: Item;
}

interface Moved {
  newIndex: number;
  oldIndex: number;
  element: Item;
}

export default interface Change {
  added?: Added;
  removed?: Removed;
  moved?: Moved;
}
