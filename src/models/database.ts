import 'firebase/firestore';
import { firestorePlugin } from 'vuefire';
import firebase from 'firebase/app';
import Vue from 'vue';

Vue.use(firestorePlugin);

export const db = firebase.initializeApp({ projectId: 'd0-n0t35' }).firestore();

export const items = db.collection('items');
export const users = db.collection('users');

export function splitText(text: string) {
  let title = '';
  let body = text;
  while (!title.length && body.length) {
    [title] = body.split('\n', 1);
    body = body.slice(title.length + 1);
  }
  title = title.trim();
  body = body.trim();
  return { title, body };
}
