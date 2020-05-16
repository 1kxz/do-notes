import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface ChangeData {
  parentId: string;
  itemId: string;
  index: number;
}

interface MoveData {
  parentId: string;
  oldIndex: number;
  newIndex: number;
}

export const itemAdd = functions.https.onCall(
  ({ parentId, itemId, index }: ChangeData) => {
    const database = admin.firestore();
    const items = database.collection('items');
    const item = items.doc(itemId);
    const parent = parentId ? items.doc(parentId) : null;
    console.log(`adding item ${itemId} at ${parentId}[${index}]`);
    return items
      .where('parent', '==', parent)
      .orderBy('order')
      .get()
      .then(qs => {
        const batch = database.batch();
        let i = 0;
        qs.forEach(qds => {
          if (i >= index) {
            console.log(`setting order of ${qds.id} to ${i + 1}`);
            batch.update(qds.ref, { order: i + 1 });
          } else {
            console.log(`order of ${qds.id} unchanged`);
          }
          i++;
        });
        batch.update(item, { parent: parent, order: index });
        return batch.commit();
      })
      .catch(console.log);
  }
);

export const itemMove = functions.https.onCall(
  ({ parentId, oldIndex, newIndex }: MoveData) => {
    let start: number, end: number, shift: number;
    if (oldIndex < newIndex) {
      start = oldIndex;
      end = newIndex;
      shift = -1;
    } else {
      start = newIndex;
      end = oldIndex;
      shift = 1;
    }
    console.log(`moving item ${parentId}[${oldIndex}] to [${newIndex}]`);
    const database = admin.firestore();
    const items = database.collection('items');
    const parent = parentId ? items.doc(parentId) : null;
    return items
      .where('parent', '==', parent)
      .orderBy('order')
      .get()
      .then(qs => {
        let index = 0;
        const batch = database.batch();
        qs.forEach(qds => {
          if (index === oldIndex) {
            console.log(`setting order of ${qds.id} to ${newIndex}`);
            batch.update(qds.ref, { order: newIndex });
          } else if (start <= index && index <= end) {
            console.log(`setting order of ${qds.id} to ${index + shift}`);
            batch.update(qds.ref, { order: index + shift });
          } else {
            console.log(`order of ${qds.id} unchanged`);
          }
          index++;
        });
        return batch.commit();
      });
  }
);

export const itemRemove = functions.https.onCall(
  ({ parentId, itemId, index }: ChangeData) => {
    const database = admin.firestore();
    const items = database.collection('items');
    const parent = parentId ? items.doc(parentId) : null;
    console.log(`removing item ${itemId} at ${parentId}[${index}]`);
    return items
      .where('parent', '==', parent)
      .orderBy('order')
      .get()
      .then(qs => {
        const batch = database.batch();
        let i = 0;
        qs.forEach(qds => {
          if (i >= index) {
            console.log(`setting order of ${qds.id} to ${i}`);
            batch.update(qds.ref, { order: i });
          } else {
            console.log(`order of ${qds.id} unchanged`);
          }
          if (qds.id !== itemId) {
            i++;
          }
        });
        return batch.commit();
      })
      .catch(console.log);
  }
);

export const itemFixIndices = functions.https.onRequest((request, response) => {
  const database = admin.firestore();
  const items = database.collection('items');
  items
    .get()
    .then(qs => {
      qs.forEach(qds => {
        console.log(`processsing ${qds.id}`);
        qds.ref
          .update({ view: 'note', noteOrientation: 'vertical' })
          .catch(error => response.send(error));
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
