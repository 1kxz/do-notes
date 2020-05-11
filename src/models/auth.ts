import 'firebase/auth';
import { firebaseApp } from '@/models/firebase';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/app';

import 'firebaseui/dist/firebaseui.css';

export const firebaseAuth = firebaseApp.auth();
export const authUi = new firebaseui.auth.AuthUI(firebaseAuth);
export const authConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
};
