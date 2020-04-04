import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import * as FirestoreService from "../../services/firestore";
import "./JoinEvent.css";

function JoinEvent(props) {
  const { event, onSelectUser, userId } = props;

  const [error, setError] = useState();

  function addNewUser(e) {
    e.preventDefault();
    setError(null);

    const userName = document.addUserForm.userName.value;
    if (!userName) {
      setError("user-name-required");
      return;
    }

    const eventPassword = document.addUserForm.eventPassword.value;
    if (!eventPassword) {
      setError("user-name-required");
      return;
    }

    FirestoreService.addUserToEvent(
      userName,
      eventPassword,
      event.eventId,
      event.defaultRoomId,
      userId
    )
      .then(() => {
        localStorage.setItem("userName", userName);
        onSelectUser(userName);
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className={"add-container"}>
      <Typography
        variant="h3"
        color="secondary"
        style={{ marginBottom: "80px" }}
      >
        VirtualDojo Rooms
      </Typography>
      <Typography
        variant="h5"
        color="secondary"
        style={{ marginBottom: "30px" }}
      >
        Please insert the following information:
      </Typography>
      <form name="addUserForm" className={"add-container"}>
        <TextField
          label="Your Full Name"
          name="userName"
          variant="filled"
          color="primary"
          style={{ marginBottom: "30px", backgroundColor: "white" }}
        />
        <TextField
          label="Event Password"
          name="eventPassword"
          variant="filled"
          color="primary"
          style={{ marginBottom: "30px", backgroundColor: "white" }}
        />
        <Button
          variant="contained"
          color="secondary"
          size="large"
          style={{ fontWeight: 600 }}
          type="submit"
          onClick={addNewUser}
        >
          {`Join the event`}
        </Button>
      </form>
      <ErrorMessage errorCode={error}></ErrorMessage>
    </div>
  );
}

export default JoinEvent;
