const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.setIsMentor = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  if (!data) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Payload must not be empty"
    );
  }
  const { eventId, userId, isMentor } = data;
  const uid = context.auth.uid;
  if (uid && uid === userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "You cannot change mentor status to yourself"
    );
  }

  let returnUser = {};
  try {
    returnUser = await db.runTransaction(async (t) => {
      let eventRef = db.collection("events").doc(eventId);
      const doc = await t.get(eventRef);
      let { users } = doc.data() || {};
      if (users) {
        // event has users property
        const userIndex = users.findIndex((u) => u.userId === userId);
        if (userIndex >= 0) {
          if (users[userIndex].isMentor === isMentor) return {};
          // event has the data user
          const updatedUser = {
            ...users[userIndex],
            isMentor,
          };
          users[userIndex] = updatedUser;
          await t.update(eventRef, { users });
          return updatedUser;
        } else {
          throw new functions.https.HttpsError("not-found", "User not found");
        }
      } else {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "The event ha no users field"
        );
      }
    });
  } catch (err) {
    throw new functions.https.HttpsError("aborted", err.message);
  }

  return {
    ...returnUser,
  };
});
