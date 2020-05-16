export default interface ItemData extends String {
  id: string;
  noteOrientation?: string;
  uid: string;
  parent: ItemData;
  text: string;
  type: string;
  view: string;
}
