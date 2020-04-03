import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";

import "./AddItem.css";
import * as FirestoreService from "../../../services/firestore";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

function AddItem(props) {
  const { eventId } = props;

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
      <Typography variant="h5">
        Room name
      </Typography>
      <TextField fullWidth name="roomName" variant="filled" />
      <Typography variant="h5">
        Room id
      </Typography>
      <TextField fullWidth name="roomId" variant="filled" />
      <Button variant="contained" color="primary" fullWidth size="large" style={{ marginTop: 20, fontWeight: 600 }} type="submit" onClick={addItem}>
        Add
      </Button>
      <ErrorMessage errorCode={error}></ErrorMessage>
    </form>
  );
}

export default AddItem;
