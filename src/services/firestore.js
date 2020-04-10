import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

export const createEvent = async (
  eventName,
  eventPassword,
  userName,
  userId
) => {
  const defaultRoomId = uuidv4();
  const docRef = await db.collection("events").add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    name: eventName,
    password: eventPassword,
    defaultRoomId,
    users: [
      {
        userId: userId,
        name: userName,
      },
    ],
    publicPeriod: {
      startDate: firebase.firestore.FieldValue.serverTimestamp(),
      endDate: firebase.firestore.FieldValue.serverTimestamp(),
    },
  });
  await addRoom("all", docRef.id, defaultRoomId);
  await db.collection("events").doc(docRef.id).collection("users").add({
    userId: userId,
    userName: userName,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    isMentor: true,
  });
  await addUserToRoom(userId, defaultRoomId, docRef.id);
  return docRef;
};

export const getEvent = (eventId) => {
  return db.collection("events").doc(eventId).get();
};

export const getEventUsers = (eventId) => {
  return db.collection("events").doc(eventId).collection("users").get();
};

export const streamEvent = (eventId, observer) => {
  return db.collection("events").doc(eventId).onSnapshot(observer);
};

export const streamEventUsers = (eventId, observer) => {
  return db
    .collection("events")
    .doc(eventId)
    .collection("users")
    .orderBy("created")
    .onSnapshot(observer);
};

export const streamEventRooms = (eventId, observer) => {
  return db
    .collection("events")
    .doc(eventId)
    .collection("rooms")
    .orderBy("created")
    .onSnapshot(observer);
};

export const streamEventRoomsUsers = (eventId, observer) => {
  return db
    .collection("events")
    .doc(eventId)
    .collection("rooms_users")
    .orderBy("created")
    .onSnapshot(observer);
};

export const isUserRegistered = (eventId, userId) => {
  return getEventUsers(eventId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventUsers) => {
      const item = eventUsers.find((eventItem) => {
        return eventItem.data().userId === userId;
      });
      return item ? item.data() : undefined;
    });
};

export const addUserToEvent = async (
  userName,
  eventPassword,
  eventId,
  defaultRoomId,
  userId,
  isMentor = false
) => {
  const eventSnapshot = await getEvent(eventId);
  if (eventSnapshot.data().password !== eventPassword)
    throw new Error("event-wrong-password");

  const usersSnapshot = await getEventUsers(eventId);
  const userInEvent = usersSnapshot.docs.find(
    (u) => u.data().userId === userId
  );

  if (userInEvent) {
    throw new Error("duplicate-item-error");
  }

  const user = await db
    .collection("events")
    .doc(eventId)
    .collection("users")
    .add({
      userId: userId,
      userName: userName,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userId,
      isMentor,
    });
  await addUserToRoom(userId, defaultRoomId, eventId);
  return user;
};

export const addRoom = async (roomName, eventId, roomId = uuidv4()) => {
  return getEventUsers(eventId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventUsers) => undefined)
    .then((matchingItem) => {
      if (!matchingItem) {
        return db.collection("events").doc(eventId).collection("rooms").add({
          roomId,
          roomName,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      throw new Error("duplicate-item-error");
    });
};

export const addUserToRoom = (userId, roomId, eventId) => {
  return db
    .collection("events")
    .doc(eventId)
    .collection("rooms_users")
    .get()
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventUsers) =>
      eventUsers.find((eventItem) => eventItem.data().userId === userId)
    )
    .then((matchingItem) => {
      if (matchingItem) {
        return db
          .collection("events")
          .doc(eventId)
          .collection("rooms_users")
          .doc(matchingItem.id)
          .update({ roomId });
      }
      return db
        .collection("events")
        .doc(eventId)
        .collection("rooms_users")
        .add({
          roomId: roomId,
          userId: userId,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        });
    });
};

export const setUserIsMentor = (userId, eventId, isMentor) => {
  return db
    .collection("events")
    .doc(eventId)
    .collection("users")
    .get()
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventUsers) =>
      eventUsers.find((eventItem) => eventItem.data().userId === userId)
    )
    .then((matchingItem) => {
      if (matchingItem) {
        return db
          .collection("events")
          .doc(eventId)
          .collection("users")
          .doc(matchingItem.id)
          .update({ isMentor });
      }
      console.warn(`User not found ${userId}`);
    });
};

export const updateEventPublicPeriod = (eventId, { startDate, endDate }) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      publicPeriod: {
        startDate: firebase.firestore.Timestamp.fromDate(startDate),
        endDate: firebase.firestore.Timestamp.fromDate(endDate),
      },
    });
};
