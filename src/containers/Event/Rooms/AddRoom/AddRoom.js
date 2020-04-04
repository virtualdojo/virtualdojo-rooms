import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import "./AddRoom.css";
import * as FirestoreService from "../../../../services/firestore";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

function AddRoom(props) {
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

    FirestoreService.addRoom(roomName, eventId)
      .then(() => document.addItemForm.reset())
      .catch((reason) => {
        if (reason.message === "duplicate-item-error") {
          setError(reason.message);
        } else {
          setError("add-list-item-error");
        }
      });
  }

  return (
    <form name="addItemForm" className="AddRoom-container">
      <Typography variant="h5" style={{ marginRight: "20px" }}>
        Create new room:
      </Typography>
      <TextField label="Room name" name="roomName" variant="filled" />
      <Button
        variant="contained"
        color="primary"
        size="large"
        style={{ marginLeft: "20px", fontWeight: 600 }}
        type="submit"
        onClick={addItem}
      >
        Add
      </Button>
      <ErrorMessage errorCode={error}></ErrorMessage>
    </form>
  );
}

export default AddRoom;
