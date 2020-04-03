import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import { useTheme } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import { CancelRounded as Cancel } from "@material-ui/icons";

import * as FirestoreService from "../../services/firestore";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import AddItem from "./AddItem/AddItem";

import ItemList from "./ItemList/ItemList";
import VideoChat from "../../components/VideoChat/VideoChat";

import "./EditEvent.css";

function EditEvent({ user, event }) {
  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState();
  const { palette } = useTheme();

  const theme = {
    container: { background: palette.primary.main },
    modal: { background: palette.background.default },
    listItem: { background: palette.grey[200] },
  };

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventItems(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventUsers(updatedEventUsers);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [event.eventId, setEventUsers]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventRooms(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventRooms = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventRooms(updatedEventRooms);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [event.eventId, setEventRooms]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventRoomsUsers(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventRoomsUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventRoomsUsers(updatedEventRoomsUsers);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [event.eventId, setEventRoomsUsers]);

  return (
    <DndProvider backend={Backend}>
      <div className="main-container" style={theme.container}>
        <VideoChat></VideoChat>

        {isModalOpen && (
          <div className="modal" style={theme.modal}>
            <IconButton color="primary" onClick={() => setIsModalOpen(false)}>
              <Cancel fontSize="large" />
            </IconButton>
            <div>
              <ErrorMessage errorCode={error}></ErrorMessage>
              <header className="app-header">
                <Typography variant="h3" component="h1">
                  {`Benvenuto a ${event.name}`}
                </Typography>
                <Typography variant="h4">
                  Ciao {user.userName}!
                </Typography>
                <Typography variant="h5">
                  {user.isMentor ? "Sei un mentor" : "Sei un ninja"}
                </Typography>
              </header>
              <div className="edit-container">
                {user.isMentor && (
                  <div className="list-column" style={theme.listItem}>
                    <AddItem
                      userId={user.userId}
                      eventId={event.eventId}
                    ></AddItem>
                  </div>
                )}
                <div className="list-column" style={theme.listItem}>
                  <ItemList
                    eventId={event.eventId}
                    eventUsers={eventUsers}
                    eventRooms={eventRooms}
                    eventRoomsUsers={eventRoomsUsers}
                  ></ItemList>
                </div>
              </div>
              <footer className="app-footer"></footer>
            </div>
          </div>
        )}
      </div>
      )
    </DndProvider>
  );
}

export default EditEvent;
