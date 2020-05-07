import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const itemFixIndices = functions.https.onRequest((request, response) => {
  const database = admin.firestore();
  const items = database.collection('items');
  items
    .get()
    .then(qs => {
      qs.forEach(qds => {
        console.log(`processsing children of ${qds.id}`);
        items
          .where('parent', '==', qds.ref)
          .orderBy('order')
          .get()
          .then(sqs => {
            let index = 0;
            sqs.forEach(sqds => {
              console.log(`setting order of ${sqds.id} to ${index}`);
              sqds.ref
                .update({ order: index })
                .catch(error => response.send(error));
              index++;
            });
          })
          .catch(error => response.send(error));
      });
    })
    .catch(error => response.send(error));
  response.send(`done`);
});

export const itemAdd = functions.https.onCall(data => {
  const database = admin.firestore();
  const items = database.collection('items');
  const item = items.doc(data.item);
  const parent = data.parent ? items.doc(data.parent) : null;
  console.log(`adding item ${data.item} at ${data.parent} [${data.index}]`);
  return items
    .where('parent', '==', parent)
    .orderBy('order')
    .get()
    .then(qs => {
      const batch = database.batch();
      let index = 0;
      qs.forEach(qds => {
        if (index >= data.index) {
          console.log(`setting order of ${qds.id} to ${index}`);
          batch.update(qds.ref, { order: index + 1 });
        }
        index++;
      });
      batch.update(item, { parent: parent, order: data.index });
      return batch.commit();
    })
    .catch(console.log);
});

export const itemMove = functions.https.onCall(data => {
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

export const itemRemove = functions.https.onCall(data => {
  const database = admin.firestore();
  const items = database.collection('items');
  const parent = data.parent ? items.doc(data.parent) : null;
  console.log(`removing item ${data.item} at ${data.parent}[${data.index}]`);
  return items
    .where('parent', '==', parent)
    .orderBy('order')
    .get()
    .then(qs => {
      const batch = database.batch();
      let index = 0;
      qs.forEach(qds => {
        if (index >= data.index && qds.id !== data.item) {
          console.log(`setting order of ${qds.id} to ${index}`);
          batch.update(qds.ref, { order: index });
          index++;
        }
      });
      return batch.commit();
    })
    .catch(console.log);
});
