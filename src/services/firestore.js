import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

if (process.env.NODE_ENV === "development") {
  firebase.functions().useFunctionsEmulator("http://localhost:5001");
}

const setIsMentor = firebase.functions().httpsCallable("setIsMentor");

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
    mentors: [userId],
    users: [
      {
        userId: userId,
        userName: userName,
        isMentor: true,
      },
    ],
    publicPeriod: {
      startDate: firebase.firestore.FieldValue.serverTimestamp(),
      endDate: addDays(new Date(), 7),
    },
    hasFreeMovement: false,
    jitsiServer: "meet.jit.si",
    docs: [],
    rooms: [],
    roomsUsers: [],
  });
  await db
    .collection("events")
    .doc(docRef.id)
    .collection("additionalData")
    .doc("private")
    .set({ password: eventPassword });
  await addRoom("all", docRef.id, defaultRoomId);
  await addUserToRoom(userId, defaultRoomId, docRef.id);
  return docRef;
};

export const getEvent = async (eventId) => {
  return db.collection("events").doc(eventId).get();
};

export const getEventUsers = (eventId) => {
  return db.collection("events").doc(eventId).collection("users").get();
};

export const streamEvent = (eventId, observer) => {
  return db.collection("events").doc(eventId).onSnapshot(observer);
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

export const addUser = async (user, eventId) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      users: firebase.firestore.FieldValue.arrayUnion(user),
    });
};

export const addRoom = async (roomName, eventId, roomId = uuidv4()) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      rooms: firebase.firestore.FieldValue.arrayUnion({
        roomId,
        roomName,
      }),
    });
};

export const addUserToRoom = async (
  userId,
  roomId,
  eventId,
  oldRoomUser = undefined
) => {
  await db
    .collection("events")
    .doc(eventId)
    .update({
      roomsUsers: firebase.firestore.FieldValue.arrayUnion({
        roomId: roomId,
        userId: userId,
      }),
    });
  if (oldRoomUser) await removeUserInRoom(oldRoomUser, eventId);
};

export const removeUserInRoom = (room, eventId) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      roomsUsers: firebase.firestore.FieldValue.arrayRemove(room),
    });
};

export const setUserIsMentor = async (userId, eventId, isMentor) => {
  return setIsMentor({ eventId, userId, isMentor });
};

export const deleteUser = async (user, eventId) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      users: firebase.firestore.FieldValue.arrayRemove(user),
    });
};

export const setEventPublicPeriod = (eventId, { startDate, endDate }) => {
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

export const setEventHasFreeMovement = (eventId, hasFreeMovement) => {
  return db.collection("events").doc(eventId).update({
    hasFreeMovement,
  });
};

export const addDoc = async (docUrl, docName, eventId, docId = uuidv4()) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      docs: firebase.firestore.FieldValue.arrayUnion({
        docId: docId,
        docUrl: docUrl,
        docName: docName,
      }),
    });
};

export const deleteDoc = (doc, eventId) => {
  return db
    .collection("events")
    .doc(eventId)
    .update({
      docs: firebase.firestore.FieldValue.arrayRemove(doc),
    });
};

export const setJitsiServer = (eventId, jitsiServer) => {
  return db.collection("events").doc(eventId).update({
    jitsiServer,
  });
};
