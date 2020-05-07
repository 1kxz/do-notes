import ItemData from './ItemData';

class Added {
  newIndex!: number;
  element!: ItemData;
}
class Removed {
  oldIndex!: number;
  element!: ItemData;
}

class Moved {
  newIndex!: number;
  oldIndex!: number;
  element!: ItemData;
}

export default class Change {
  added?: Added;
  removed?: Removed;
  moved?: Moved;
}
