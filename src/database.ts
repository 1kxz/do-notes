import 'firebase/firestore';
import { firebaseApp } from '@/firebase';
import { firestorePlugin } from 'vuefire';
import Vue from 'vue';

Vue.use(firestorePlugin);

export const firestore = firebaseApp.firestore();
export const items = firestore.collection('items');
export const users = firestore.collection('users');
