import React from "react";
import "./EditEvent.css";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import AddItem from "./AddItem/AddItem";
import ItemList from "./ItemList/ItemList";

function EditEvent(props) {
  const { user, event } = props;

  console.log("user ", user);
  return (
    <DndProvider backend={Backend}>
      <div>
        <header className="app-header">
          <h1>{`Benvenuto a ${event.name}`}</h1>
          <p>
            <strong>Ciao {user.userName}!</strong>
          </p>
          <p>
            <strong>{user.isMentor ? "Sei un mentor" : "Sei un ninja"}</strong>
          </p>
        </header>
        <div className="edit-container">
          {user.isMentor && (
            <div className="list-column">
              <AddItem userId={user.userId} eventId={event.eventId}></AddItem>
            </div>
          )}
          <div className="list-column">
            <ItemList eventId={event.eventId}></ItemList>
          </div>
        </div>
        <footer className="app-footer"></footer>
      </div>
    </DndProvider>
  );
}

export default EditEvent;
