import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

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

export const createEvent = (eventName, userName, userId) => {
  return db
    .collection("events")
    .add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userId,
      name: eventName,
      users: [
        {
          userId: userId,
          name: userName,
        },
      ],
    })
    .then((docRef) => {
      addUserToEvent(userName, docRef.id, userId, true);
      return docRef;
    })
    .then((docRef) => docRef);
};

export const getEvent = (eventId) => {
  return db.collection("events").doc(eventId).get();
};

export const getEventItems = (eventId) => {
  return db.collection("events").doc(eventId).collection("items").get();
};

export const streamEventItems = (eventId, observer) => {
  return db
    .collection("events")
    .doc(eventId)
    .collection("items")
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
  return getEventItems(eventId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventItems) => {
      const item = eventItems.find((eventItem) => {
        return eventItem.data().userId === userId;
      });
      return item ? item.data() : undefined;
    });
};

export const addUserToEvent = (userName, eventId, userId, isMentor = false) => {
  return getEventItems(eventId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventItems) =>
      eventItems.find((eventItem) => eventItem.data().userId === userId)
    )
    .then((matchingItem) => {
      // if (!matchingItem) {
      return db.collection("events").doc(eventId).collection("items").add({
        userId: userId,
        userName: userName,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: userId,
        isMentor,
      });
      //}
      //throw new Error('duplicate-item-error');
    });
};

export const addRoom = (roomId, roomName, eventId) => {
  return getEventItems(eventId)
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventItems) => undefined)
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
    .then((eventItems) =>
      eventItems.find((eventItem) => eventItem.data().userId === userId)
    )
    .then((matchingItem) => {
      console.log(matchingItem);
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
    .collection("items")
    .get()
    .then((querySnapshot) => querySnapshot.docs)
    .then((eventItems) =>
      eventItems.find((eventItem) => eventItem.data().userId === userId)
    )
    .then((matchingItem) => {
      if (matchingItem) {
        return db
          .collection("events")
          .doc(eventId)
          .collection("items")
          .doc(matchingItem.id)
          .update({ isMentor });
      }
      console.warn(`User not found ${userId}`);
    });
};
