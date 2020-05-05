import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const moveItems = functions.https.onCall(data => {
  let start: number, end: number, shift: number;
  if (data.old < data.new) {
    start = data.old;
    end = data.new;
    shift = -1;
  } else {
    start = data.new;
    end = data.old;
    shift = 1;
  }
  console.log(`${data.parent}: ${data.old} => ${data.new}`);
  const database = admin.firestore();
  const items = database.collection('items');
  return items
    .where('parent', '==', data.parent ? items.doc(data.parent) : null)
    .orderBy('order')
    .get()
    .then(qs => {
      let index = 0;
      const batch = database.batch();
      qs.forEach(qds => {
        if (index === data.old) {
          console.log(`${index} => ${data.new}`);
          batch.update(qds.ref, { order: data.new });
        } else if (start <= index && index <= end) {
          console.log(`${index} => ${index + shift}`);
          batch.update(qds.ref, { order: index + shift });
        }
        index++;
      });
      return batch.commit();
    });
});
