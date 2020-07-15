import firebase from 'firebase/app';
import 'firebase/firestore';

const { Timestamp } = firebase.firestore;

export function splitText(text: string) {
  let title = '';
  let body = text;
  while (!title.length && body.length) {
    [title] = body.split('\n', 1);
    body = body.slice(title.length + 1);
  }
  if (title === ' ') title = '';
  return { title, body };
}

export function dateToString(date: typeof Timestamp | Date | undefined) {
  let str: string;
  if (date instanceof Timestamp) {
    str = date.toDate().toISOString();
  } else if (date instanceof Date) {
    str = date.toISOString();
  } else if (date === undefined) {
    return undefined;
  } else {
    throw 'object is not a valid date';
  }
  return str
    .substr(0, str.indexOf('.'))
    .replace('T', ' ')
    .replace('Z', '');
}
