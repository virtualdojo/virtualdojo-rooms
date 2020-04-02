import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import * as FirestoreService from "../../services/firestore";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import AddItem from "./AddItem/AddItem";
import ItemList from "./ItemList/ItemList";
import VideoChat from "../../components/VideoChat/VideoChat";
import "./EditEvent.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

function EditEvent({ user, event }) {
  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [error, setError] = useState();

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
      <div style={containerStyle}>
        <VideoChat></VideoChat>

        {isModalOpen && (
          <div className="modal">
            <button onClick={() => setIsModalOpen(false)}>{`Close`}</button>
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
                    <AddItem
                      userId={user.userId}
                      eventId={event.eventId}
                    ></AddItem>
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
        )}
      </div>
      )
    </DndProvider>
  );
}

export default EditEvent;
