import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import * as FirestoreService from "./services/firestore";

import CreateEvent from "./containers/CreateEvent/CreateEvent";
import JoinEvent from "./containers/JoinEvent/JoinEvent";
import Event from "./containers/Event/Event";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";

import useQueryString from "./hooks/useQueryString";

function App() {
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [eventMeta, setEventMeta] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [eventId, setEventId] = useQueryString("eventId");
  const { palette } = useTheme();

  const theme = {
    container: {
      background: palette.primary.main,
      width: "100%",
      height: "100vh",
    },
  };

  useEffect(() => {
    FirestoreService.authenticateAnonymously()
      .then((userCredential) => {
        setUserId(userCredential.user.uid);
        if (eventId) {
          return FirestoreService.getEvent(eventId)
            .then((event) => {
              if (event.exists) {
                setError(null);
                setEventMeta(event.data());
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
    FirestoreService.getEvent(eventId)
      .then((event) => {
        if (event.exists) {
          setError(null);
          setEventMeta(event.data());
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
    setEventMeta();
    setUser();
  }

  function onSelectUser(userName) {
    setUser(userName);
    FirestoreService.getEvent(eventId)
      .then((updatedEvent) => setEventMeta(updatedEvent.data()))
      .catch(() => setError("event-get-fail"));
  }

  if (isLoading)
    return (
      <div
        style={{
          ...theme.container,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          color="secondary"
          style={{ marginBottom: "80px" }}
        >
          VirtualDojo Rooms
        </Typography>
      </div>
    );

  if (eventMeta && user) {
    return (
      <DndProvider backend={Backend}>
        <div style={theme.container}>
          <Event user={user} event={{ eventId, ...eventMeta }} />
        </div>
      </DndProvider>
    );
  } else if (eventMeta) {
    return (
      <div style={theme.container}>
        <ErrorMessage errorCode={error}></ErrorMessage>
        <JoinEvent
          users={eventMeta.users}
          {...{ eventId, onSelectUser, onCloseEvent, userId }}
        />
      </div>
    );
  }
  return (
    <div style={theme.container}>
      <ErrorMessage errorCode={error} />
      <CreateEvent onCreate={onEventCreate} userId={userId} />
    </div>
  );
}

export default App;
