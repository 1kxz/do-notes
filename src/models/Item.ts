export default interface Item extends String {
  id: string;
  uid: string;
  parent: Item;
  text: string;
  format: string;
  view: string;
  orientation?: string;
}
