import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import {
  DescriptionRounded as DocumentIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
  VideocamRounded as VideocamRoundedIcon,
} from "@material-ui/icons";

import * as FirestoreService from "../../services/firestore";

import Dashboard from "./Dashboard/Dashboard";
import Document from "./Document/Document";
import VideoChat from "./VideoChat/VideoChat";

import "./Event.css";

function EditEvent({ user, event }) {
  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const unsubscribe = FirestoreService.streamEventUsers(event.eventId, {
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

  const userMeta = eventUsers.find((u) => u.userId === user.userId) || user;
  const userRoom = eventRoomsUsers.find((ru) => ru.userId === user.userId);
  const userRoomDetails =
    userRoom && eventRooms.find((er) => er.roomId === userRoom.roomId);
  return (
    <div className="main-container" style={theme.container}>
      {!isModalOpen && !isDocumentOpen && (
        <div style={{ position: "fixed" }}>
          <IconButton color="secondary" onClick={() => toggleModal()}>
            <PeopleAltRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton color="secondary" onClick={() => toggleDocument()}>
            <DocumentIcon fontSize="large" />
          </IconButton>
        </div>
      )}
      <VideoChat
        user={userMeta}
        room={userRoomDetails}
        isMenuOpen={isModalOpen || isDocumentOpen}
        event={event}
      ></VideoChat>

      <div
        className={
          isDocumentOpen
            ? "Document-modal"
            : "Document-modal Document-modal-closed"
        }
        style={theme.modal}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <IconButton color="primary" onClick={() => toggleDocument()}>
            <VideocamRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton color="primary" onClick={() => toggleModal()}>
            <PeopleAltRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton color="primary" onClick={() => toggleDocument()} disabled>
            <DocumentIcon fontSize="large" />
          </IconButton>
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginRight: "140px",
            }}
          >
            <Typography variant="h5" color="primary">
              {event.name}
            </Typography>
          </div>
        </div>
        <Document isOpen={isDocumentOpen}></Document>
      </div>
      <div
        className={
          isModalOpen
            ? "Dashboard-modal"
            : "Dashboard-modal Dashboard-modal-closed"
        }
        style={theme.modal}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <IconButton color="primary" onClick={() => toggleModal()}>
            <VideocamRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton color="primary" onClick={() => toggleModal()} disabled>
            <PeopleAltRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton color="primary" onClick={() => toggleDocument()}>
            <DocumentIcon fontSize="large" />
          </IconButton>
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginRight: "140px",
            }}
          >
            <Typography variant="h5" color="primary">
              {event.name}
            </Typography>
          </div>
        </div>
        <Dashboard
          user={user}
          event={event}
          error={error}
          userMeta={userMeta}
          eventUsers={eventUsers}
          eventRooms={eventRooms}
          eventRoomsUsers={eventRoomsUsers}
        />
      </div>
    </div>
  );
}

export default EditEvent;
