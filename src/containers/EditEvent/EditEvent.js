import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import * as FirestoreService from "../../services/firestore";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import AddItem from "./AddItem/AddItem";
import ItemList from "./ItemList/ItemList";
import VideoChat from "../../components/VideoChat/VideoChat";
import Document from "../../components/Document/Document";
import "./EditEvent.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
  overflowX: "hidden",
};

function EditEvent({ user, event }) {
  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [error, setError] = useState();

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

  const userRoom = eventRoomsUsers.find((ru) => ru.userId === user.userId);
  const userRoomDetails =
    userRoom && eventRooms.find((er) => er.roomId === userRoom.roomId);
  return (
    <div style={containerStyle}>
      <div style={{ position: "fixed" }}>
        {
          <button onClick={() => toggleModal()}>{`${
            isModalOpen ? "close" : "open"
          } dashboard`}</button>
        }
        {
          <button onClick={() => toggleDocument()}>{`${
            isDocumentOpen ? "close" : "open"
          } document`}</button>
        }
      </div>
      <VideoChat
        user={user}
        room={userRoomDetails}
        isMenuOpen={isModalOpen || isDocumentOpen}
      ></VideoChat>
      <Document isOpen={isDocumentOpen}></Document>
      <div className={isModalOpen ? "Edit-modal-opened " : "Edit-modal-closed"}>
        <div>
          <ErrorMessage errorCode={error}></ErrorMessage>
          <header className="app-header">
            <h1>{`Benvenuto a ${event.name}`}</h1>
            <p>
              <strong>Ciao {user.userName}!</strong>
            </p>
            <p>
              <strong>
                {user.isMentor ? "Sei un mentor" : "Sei un ninja"}
              </strong>
            </p>
          </header>
          <div className="edit-container">
            {user.isMentor && (
              <div className="list-column">
                <AddItem userId={user.userId} eventId={event.eventId}></AddItem>
              </div>
            )}
            <div className="list-column">
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
    </div>
  );
}

export default EditEvent;
