export default class ItemData {
  id!: string;
  owner!: string;
  parent?: ItemData;
  text!: string;
  type!: string;
  view!: string;
}
