import React from "react";
import "./EditEvent.css";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import AddItem from "./AddItem/AddItem";
import ItemList from "./ItemList/ItemList";

function EditEvent(props) {
  const { eventId, user, onCloseEvent, userId, event } = props;

  function onCreateListClick(e) {
    e.preventDefault();
    onCloseEvent();
  }

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
              <AddItem {...{ eventId, userId }}></AddItem>
            </div>
          )}
          <div className="list-column">
            <ItemList {...{ eventId }}></ItemList>
          </div>
        </div>
        <footer className="app-footer">
          <p>
            <a href="/" onClick={onCreateListClick}>
              Crea un nuovo evento
            </a>
            .
          </p>
        </footer>
      </div>
    </DndProvider>
  );
}

export default EditEvent;
