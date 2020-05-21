import 'firebase/firestore';
import { firebaseApp } from '@/models/firebase';
import { firestorePlugin } from 'vuefire';
import Vue from 'vue';

Vue.use(firestorePlugin);

export const firestore = firebaseApp.firestore();
export const items = firestore.collection('items');
export const users = firestore.collection('users');

export function splitText(text: string) {
  let title = '';
  let body = text;
  while (!title.length && body.length) {
    [title] = body.split('\n', 1);
    body = body.slice(title.length + 1);
  }
  return { title, body };
}
