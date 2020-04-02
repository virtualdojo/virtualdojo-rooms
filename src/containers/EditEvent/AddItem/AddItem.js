import React, { useState } from "react";
import "./AddItem.css";
import * as FirestoreService from "../../../services/firestore";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

function AddItem(props) {
  const { eventId, userId } = props;

  const [error, setError] = useState("");

  function addItem(e) {
    e.preventDefault();
    setError(null);

    const roomName = document.addItemForm.roomName.value;
    if (!roomName) {
      setError("user-desc-req");
      return;
    }

    const roomId = document.addItemForm.roomId.value;
    if (!roomId) {
      setError("user-desc-req");
      return;
    }

    FirestoreService.addRoom(roomId, roomName, eventId)
      .then(() => document.addItemForm.reset())
      .catch((reason) => {
        if (reason.message === "duplicate-item-error") {
          setError(reason.message);
        } else {
          console.log(reason);
          setError("add-list-item-error");
        }
      });
  }

  return (
    <form name="addItemForm">
      <h3>Room name</h3>
      <input type="text" name="roomName" />
      <h3>Room id</h3>
      <input type="text" name="roomId" />
      <button type="submit" onClick={addItem}>
        Add
      </button>
      <ErrorMessage errorCode={error}></ErrorMessage>
    </form>
  );
}

export default AddItem;
