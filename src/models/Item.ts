export default interface Item extends String {
  id: string;
  uid: string;
  parent: string;
  title: string;
  content: string | null;
  format: string;
  view: string;
  collapsed: boolean | null;
  order: number;
  active: number | null;
  created: Date;
  updated: Date;
}
