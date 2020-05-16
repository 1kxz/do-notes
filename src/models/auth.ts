import 'firebase/auth';
import { firebaseApp } from '@/models/firebase';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/app';

export const firebaseAuth = firebaseApp.auth();
export const authUi = new firebaseui.auth.AuthUI(firebaseAuth);
export const authConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};
