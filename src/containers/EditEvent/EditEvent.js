import React, { useEffect, useState } from "react";

import { useTheme } from "@material-ui/core/styles";
import { Button, IconButton } from "@material-ui/core";
import { CancelRounded as Cancel } from "@material-ui/icons";

import * as FirestoreService from "../../services/firestore";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import AddItem from "./AddItem/AddItem";

import ItemList from "./ItemList/ItemList";
import VideoChat from "../../components/VideoChat/VideoChat";

import Document from "../../components/Document/Document";
import "./EditEvent.css";

function EditEvent({ user, event }) {
  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [error, setError] = useState();
  const { palette } = useTheme();

  const theme = {
    container: { background: palette.primary.main },
    modal: { background: palette.background.default },
    listItem: { background: palette.grey[200] },
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) setIsDocumentOpen(false);
  };

  const toggleDocument = () => {
    setIsDocumentOpen(!isDocumentOpen);
    if (!isDocumentOpen) setIsModalOpen(false);
  };

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventItems(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];

        console.log("EditEvent -> updatedEventUsers", updatedEventUsers);
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

  const userMeta = eventUsers.find((u) => u.userId === user.userId);
  const userRoom = eventRoomsUsers.find((ru) => ru.userId === user.userId);
  const userRoomDetails =
    userRoom && eventRooms.find((er) => er.roomId === userRoom.roomId);
  return (
    <div className="main-container" style={theme.container}>
      <div style={{ position: "fixed" }}>
        {
          <Button onClick={() => toggleModal()}>{`${
            isModalOpen ? "close" : "open"
          } dashboard`}</Button>
        }
        {
          <Button onClick={() => toggleDocument()}>{`${
            isDocumentOpen ? "close" : "open"
          } document`}</Button>
        }
      </div>
      <VideoChat
        user={user}
        room={userRoomDetails}
        isMenuOpen={isModalOpen || isDocumentOpen}
      ></VideoChat>
      <Document isOpen={isDocumentOpen}></Document>
      <div className={isModalOpen ? "Edit-modal" : "Edit-modal Edit-modal-closed"} style={theme.modal}>
        <IconButton color="primary" onClick={() => setIsModalOpen(false)}>
          <Cancel fontSize="large" />
        </IconButton>
        <div>
          <ErrorMessage errorCode={error}></ErrorMessage>
          <div className="edit-container">
            {user.isMentor && (
              <div className="list-column" style={theme.listItem}>
                <AddItem userId={user.userId} eventId={event.eventId}></AddItem>
              </div>
            )}
            <div className="list-column" style={theme.listItem}>
              <ItemList
                eventId={event.eventId}
                currentUser={userMeta || {}}
                eventUsers={eventUsers}
                eventRooms={eventRooms}
                eventRoomsUsers={eventRoomsUsers}
              ></ItemList>
            </div>
          </div>
          <footer className="app-footer"></footer>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;
