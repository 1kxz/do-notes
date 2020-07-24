export default interface Item extends String {
  id: string;
  uid: string;
  parent: string;
  content: string;
  title: string;
  format: string;
  view: string;
  collapsed: boolean;
  created: Date;
  updated: Date;
}
