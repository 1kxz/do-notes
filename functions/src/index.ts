import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const moveItems = functions.https.onCall((data, context) => {
  const [start, end] = [data.old, data.new].sort();
  const delta = data.old < data.new ? -1 : 1;
  admin
    .firestore()
    .collection('items')
    .where('parent', '==', data.id)
    .get()
    .then(qs =>
      qs.forEach(qds => {
        const item = qds.data();
        if (item.order === data.old) {
          qds.ref.update({ order: data.new });
        } else if (start <= item.order && item.order <= end) {
          qds.ref.update({ order: item.order + delta });
        }
      })
    );
  return 'somethign happened';
});
