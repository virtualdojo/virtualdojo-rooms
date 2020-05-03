const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const DEFAULT_REGION = "europe-west1";

admin.initializeApp();
const db = admin.firestore();

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

exports.createEvent = functions
  .region(DEFAULT_REGION)
  .https.onCall(async (data, context) => {
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
    const {
      eventName,
      eventPassword,
      mentorPassword,
      userName,
      additionalConfig,
      roomName,
    } = data;
    const userId = context.auth.uid;

    let returnUser = {};

    const defaultRoomId = uuidv4();
    let returnDocId;
    try {
      const docRef = await db.collection("events").add({
        created: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: userId,
        name: eventName,
        password: eventPassword,
        defaultRoomId,
        mentors: [userId],
        users: [
          {
            userId,
            userName,
            isMentor: true,
          },
        ],
        publicPeriod: {
          startDate: admin.firestore.FieldValue.serverTimestamp(),
          endDate: addDays(new Date(), 7),
        },
        hasFreeMovement: false,
        jitsiServer: "meet.jit.si",
        docs: [],
        rooms: [
          {
            roomId: defaultRoomId,
            roomName,
          },
        ],
        roomsUsers: [
          {
            roomId: defaultRoomId,
            userId,
          },
        ],
      });

      await db
        .collection("events")
        .doc(docRef.id)
        .collection("additionalData")
        .doc("private")
        .set({ password: eventPassword, mentorPassword });
      returnDocId = docRef.id;
    } catch (err) {
      throw new functions.https.HttpsError("aborted", err.message);
    }

    return {
      id: returnDocId,
    };
  });

exports.joinEvent = functions
  .region(DEFAULT_REGION)
  .https.onCall(async (data, context) => {
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

    const { userName, eventId, password } = data;
    const userId = context.auth.uid;

    let returnUser = {};
    try {
      returnUser = await db.runTransaction(async (t) => {
        let eventRef = db.collection("events").doc(eventId);
        const doc = await t.get(eventRef);
        let privateData = await db
          .collection("events")
          .doc(eventId)
          .collection("additionalData")
          .doc("private")
          .get();
        let { users, mentors, roomsUsers, defaultRoomId } = doc.data() || {};
        let { password: eventPassword, mentorPassword } =
          privateData.data() || {};
        console.log("password, mentorPassword", password, mentorPassword);
        if (users) {
          const hasUser = users.findIndex((u) => u.userId === userId) >= 0;
          if (hasUser) {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "User already registered"
            );
          }
          if (password !== eventPassword && password !== mentorPassword) {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "wrong password"
            );
          }
          const user = {
            userId,
            userName,
            isMentor: password === mentorPassword,
          };
          const hasUserAsMentor = mentors.findIndex((m) => m === userId) >= 0;
          if (password === mentorPassword && !hasUserAsMentor) {
            mentors.push(userId);
          }
          await t.update(eventRef, {
            users: users.concat(user),
            roomsUsers: roomsUsers.concat({ userId, roomId: defaultRoomId }),
            mentors,
          });
          return user;
        } else {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "The event has no users fields"
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

exports.setIsMentor = functions
  .region(DEFAULT_REGION)
  .https.onCall(async (data, context) => {
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
            "The event has no users field"
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

exports.moveUserToRoom = functions
  .region(DEFAULT_REGION)
  .https.onCall(async (data, context) => {
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
    const { eventId, userId, roomId } = data;
    const uid = context.auth.uid;

    let returnRoomUser = {};
    try {
      returnRoomUser = await db.runTransaction(async (t) => {
        let eventRef = db.collection("events").doc(eventId);
        const doc = await t.get(eventRef);
        let { users, rooms, roomsUsers } = doc.data() || {};
        if (users && rooms && roomsUsers) {
          const hasUser = users.findIndex((u) => u.userId === userId) >= 0;
          const hasRoom = rooms.findIndex((r) => r.roomId === roomId) >= 0;
          if (!hasUser || !hasRoom) {
            throw new functions.https.HttpsError(
              "not-found",
              "User or Room not found"
            );
          }
          // event has users property
          const roomUserIndex = roomsUsers.findIndex(
            (ru) => ru.userId === userId
          );
          const updatedRoomUser = { userId, roomId };
          if (roomUserIndex >= 0) {
            roomsUsers[roomUserIndex] = updatedRoomUser;
          } else {
            roomsUsers.push(updatedRoomUser);
          }
          await t.update(eventRef, { roomsUsers });
          return updatedRoomUser;
        } else {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "The event has no fields"
          );
        }
      });
    } catch (err) {
      throw new functions.https.HttpsError("aborted", err.message);
    }

    return {
      ...returnRoomUser,
    };
  });
