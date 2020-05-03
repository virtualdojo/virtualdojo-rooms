import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};
const DEFAULT_REGION = "europe-west1";

firebase.initializeApp(firebaseConfig);
const functions = firebase.app().functions(DEFAULT_REGION);
const db = firebase.firestore();

if (process.env.NODE_ENV === "development") {
  functions.useFunctionsEmulator("http://localhost:5001");
}

const setIsMentorFunction = functions.httpsCallable("setIsMentorFunction");
const moveUserToRoomFunction = functions.httpsCallable("moveUserToRoom");
const createEventFunction = functions.httpsCallable("createEvent");
const joinEvent = functions.httpsCallable("joinEvent");

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};

export const createEvent = async ({
  eventName,
  eventPassword,
  mentorPassword,
  userName,
  additionalConfig,
}) => {
  const { data } = await createEventFunction({
    eventName,
    eventPassword,
    mentorPassword,
    userName,
    roomName: "All",
    additionalConfig,
  });
  return data.id;
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

export const addUserToEvent = async (userName, eventId, password) => {
  const { data } = await joinEvent({
    userName,
    eventId,
    password,
  });
  return data;
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
  await moveUserToRoomFunction({ userId, roomId, eventId });
};

export const setUserIsMentor = async (userId, eventId, isMentor) => {
  return setIsMentorFunction({ eventId, userId, isMentor });
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
