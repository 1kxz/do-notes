import ItemData from './ItemData';

class Moved {
  newIndex!: number;
  oldIndex!: number;
  element!: ItemData;
}

export default class Change {
  moved?: Moved;
}
