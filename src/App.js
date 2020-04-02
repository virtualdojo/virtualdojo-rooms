import React, { useState, useEffect } from "react";

import * as FirestoreService from "./services/firestore";

import CreateEvent from "./containers/CreateEvent/CreateEvent";
import JoinEvent from "./containers/JoinEvent/JoinEvent";
import EditEvent from "./containers/EditEvent/EditEvent";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";

import useQueryString from "./hooks/useQueryString";

function App() {
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [event, setEvent] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [eventId, setEventId] = useQueryString("eventId");

  useEffect(() => {
    FirestoreService.authenticateAnonymously()
      .then((userCredential) => {
        setUserId(userCredential.user.uid);
        if (eventId) {
          return FirestoreService.getEvent(eventId)
            .then((event) => {
              if (event.exists) {
                setError(null);
                setEvent(event.data());
              } else {
                setError("event-not-found");
                setEventId();
              }
            })
            .catch(() => {
              setError("event-get-fail");
            })
            .then(() =>
              FirestoreService.isUserRegistered(
                eventId,
                userCredential.user.uid
              )
            )
            .then((result) => setUser(result));
        }
      })
      .then(() => setIsLoading(false))
      .catch(() => {
        setError("anonymous-auth-failed");
        setIsLoading(false);
      });
  }, [eventId, setEventId]);

  function onEventCreate(eventId, userName) {
    setEventId(eventId);
    console.log(eventId);
    FirestoreService.getEvent(eventId)
      .then((event) => {
        if (event.exists) {
          setError(null);
          setEvent(event.data());
        } else {
          setError("event-not-found");
          setEventId();
        }
      })
      .catch(() => {
        setError("event-get-fail");
      })
      .then(() => FirestoreService.isUserRegistered(eventId, userId))
      .then((result) => setUser(result));
  }

  function onCloseEvent() {
    setEventId();
    setEvent();
    setUser();
  }

  function onSelectUser(userName) {
    setUser(userName);
    FirestoreService.getEvent(eventId)
      .then((updatedEvent) => setEvent(updatedEvent.data()))
      .catch(() => setError("event-get-fail"));
  }

  // render a scene based on the current state
  if (isLoading) return <div>{`Loading...`}</div>;
  if (event && user) {
    return (
      <EditEvent
        {...{ eventId, user, onCloseEvent, userId, event }}
      ></EditEvent>
    );
  } else if (event) {
    return (
      <div>
        <ErrorMessage errorCode={error}></ErrorMessage>
        <JoinEvent
          users={event.users}
          {...{ eventId, onSelectUser, onCloseEvent, userId }}
        ></JoinEvent>
      </div>
    );
  }
  return (
    <div>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <CreateEvent onCreate={onEventCreate} userId={userId}></CreateEvent>
    </div>
  );
}

export default App;
