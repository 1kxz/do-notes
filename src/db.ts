import 'firebase/firestore';
import { firestorePlugin } from 'vuefire';
import firebase from 'firebase/app';
import Vue from 'vue';

Vue.use(firestorePlugin);

export const db = firebase.initializeApp({ projectId: 'd0-n0t35' }).firestore();
