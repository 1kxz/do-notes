import 'firebase/functions';
import firebase from 'firebase/app';

export const functions = firebase.functions();
export const itemAdd = functions.httpsCallable('itemAdd');
export const itemMove = functions.httpsCallable('itemMove');
export const itemRemove = functions.httpsCallable('itemRemove');

if (process.env.NODE_ENV === 'development') {
  functions.useFunctionsEmulator('http://localhost:5001');
}
