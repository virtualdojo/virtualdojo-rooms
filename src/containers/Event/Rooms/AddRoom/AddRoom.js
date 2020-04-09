import React, { useContext } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import "./AddRoom.css";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import { store } from "../../../store.js";

function AddRoom() {
  const { addRoom, error } = useContext(store);

  function addItem(e) {
    e.preventDefault();
    const roomName = document.addItemForm.roomName.value;
    addRoom(roomName).then(() => document.addItemForm.reset());
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
