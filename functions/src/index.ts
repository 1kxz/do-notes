import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface AddData {
  uid: string;
  parentId: string;
  itemId: string;
  newIndex: number;
}

interface MoveData {
  uid: string;
  parentId: string;
  oldIndex: number;
  newIndex: number;
}

interface RemoveData {
  uid: string;
  parentId: string;
  itemId: string;
  oldIndex: number;
}

export const itemAdd = functions.https.onCall(
  ({ uid, parentId, itemId, newIndex }: AddData) => {
    const database = admin.firestore();
    const items = database.collection('items');
    const item = items.doc(itemId);
    console.log(`adding item ${itemId} at ${parentId}[${newIndex}]`);
    return items
      .where('uid', '==', uid)
      .where('parent', '==', parentId)
      .orderBy('order')
      .get()
      .then(queryset => {
        const batch = database.batch();
        for (let index = 0; index < queryset.docs.length; index++) {
          const doc = queryset.docs[index];
          if (index >= newIndex) {
            console.log(`setting order of ${doc.id} to ${index + 1}`);
            batch.update(doc.ref, { order: index + 1 });
          } else {
            console.log(`order of ${doc.id} unchanged`);
          }
        }
        batch.update(item, { parent: parentId, order: newIndex });
        return batch.commit();
      })
      .catch(console.log);
  }
);

export const itemMove = functions.https.onCall(
  ({ uid, parentId, oldIndex, newIndex }: MoveData) => {
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
    return items
      .where('uid', '==', uid)
      .where('parent', '==', parentId)
      .orderBy('order')
      .get()
      .then(queryset => {
        const batch = database.batch();
        for (let index = 0; index < queryset.docs.length; index++) {
          const doc = queryset.docs[index];
          if (index === oldIndex) {
            console.log(`setting order of ${doc.id} to ${newIndex}`);
            batch.update(doc.ref, { order: newIndex });
          } else if (start <= index && index <= end) {
            console.log(`setting order of ${doc.id} to ${index + shift}`);
            batch.update(doc.ref, { order: index + shift });
          } else {
            console.log(`order of ${doc.id} unchanged`);
          }
        }
        return batch.commit();
      });
  }
);

export const itemRemove = functions.https.onCall(
  ({ uid, parentId, itemId, oldIndex }: RemoveData) => {
    const database = admin.firestore();
    const items = database.collection('items');
    console.log(`removing item ${itemId} at ${parentId}[${oldIndex}]`);
    return items
      .where('uid', '==', uid)
      .where('parent', '==', parentId)
      .orderBy('order')
      .get()
      .then(queryset => {
        const batch = database.batch();
        let order = 0;
        for (let index = 0; index < queryset.docs.length; index++) {
          const doc = queryset.docs[index];
          if (index >= oldIndex) {
            console.log(`setting order of ${doc.id} to ${order}`);
            batch.update(doc.ref, { order: order });
          } else {
            console.log(`order of ${doc.id} unchanged`);
          }
          if (doc.id !== itemId) {
            order++;
          }
        }
        return batch.commit();
      })
      .catch(console.log);
  }
);

export const itemFixIndices = functions.https.onRequest((request, response) => {
  const database = admin.firestore();
  const items = database.collection('items');
  return items
    .get()
    .then(qs => {
      qs.forEach(qds => {
        console.log(`processsing ${qds.id}`);
        const { orientation, view, ...newDoc } = qds.data();
        let newView = view;
        if (view === 'note' && orientation === 'vertical') {
          newView = 'pad';
        }
        if (view === 'note' && orientation === 'horizontal') {
          newView = 'board';
        }
        if (view === 'image') {
          newView = 'image';
        }
        return qds.ref
          .set({
            view: newView,
            ...newDoc
          })
          .catch(console.log);
        // return items
        //   .where('parent', '==', qds.ref)
        //   .orderBy('order')
        //   .get()
        //   .then(sqs => {
        //     let index = 0;
        //     sqs.forEach(sqds => {
        //       console.log(`setting order of ${sqds.id} to ${index}`);
        //       sqds.ref
        //         .update({ order: index })
        //         .catch(error => response.send(error));
        //       index++;
        //     });
        //   })
        //   .catch(error => response.send(error));
      });
    })
    .then(() => response.send(`done`))
    .catch(console.log);
});
