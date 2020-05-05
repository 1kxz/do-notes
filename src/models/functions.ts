import 'firebase/functions';
import firebase from 'firebase/app';

export const functions = firebase.functions();
export const moveItems = functions.httpsCallable('moveItems');

if (process.env.NODE_ENV === 'development') {
  functions.useFunctionsEmulator('http://localhost:5001');
}
