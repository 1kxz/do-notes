export default interface ItemData {
  id: string;
  noteOrientation?: string;
  owner: string;
  parent?: ItemData;
  text: string;
  type: string;
  view: string;
}
