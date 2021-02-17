import firebase from 'firebase/app';
import 'firebase/firestore';

const { Timestamp } = firebase.firestore;

export function splitText(text: string) {
  const n = text.indexOf('\n');
  const i = text[0] === '#' ? text[1] === ' ' ? 2 : 1 : 0;
  if (n < 0) {
    return { title: text.slice(i), content: null };
  }
  return { title: text.slice(i, n), content: text.slice(n + 1) };
}

export function joinText(title: string, content: string | null) {
  if (content !== null) {
    return `# ${title}\n${content}`;
  }
  return `# ${title}`;
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
