import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import * as FirestoreService from "../../services/firestore";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import "./CreateEvent.css";

function CreateEvent(props) {
  const { onCreate, userId } = props;

  const [error, setError] = useState();
  const { palette } = useTheme();

  function createEvent(e) {
    e.preventDefault();
    setError(null);

    const eventName = document.createListForm.eventName.value;
    if (!eventName) {
      setError("event-name-required");
      return;
    }

    const userName = document.createListForm.userName.value;
    if (!userName) {
      setError("user-name-required");
      return;
    }

    const eventPassword = document.createListForm.eventPassword.value;
    if (!eventPassword) {
      setError("user-name-required");
      return;
    }

    FirestoreService.createEvent(eventName, eventPassword, userName, userId)
      .then((docRef) => {
        onCreate(docRef.id, userName);
      })
      .catch((reason) => {
        setError("create-list-error");
      });
  }

  const theme = {
    container: { background: palette.background.default },
    modal: { background: palette.primary.main },
    listItem: { background: palette.grey[200] },
  };

  return (
    <div className={"main-container"} style={theme.container}>
      <div className={"Create-modal"} style={theme.modal}>
        <Typography
          variant="h3"
          color="secondary"
          align="center"
          style={{ marginTop: "20px", marginBottom: "10px" }}
        >
          VirtualDojo Rooms
        </Typography>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
          style={{ marginBottom: "15px" }}
        >
          Please insert the following information:
        </Typography>
        <form name="createListForm" className={"create-container"}>
          <TextField
            label="Your Full Name"
            name="userName"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label="Event Name"
            name="eventName"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label="Event Password"
            name="eventPassword"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <Button
            variant="contained"
            color="secondary"
            size="large"
            style={{ fontWeight: 600 }}
            type="submit"
            onClick={createEvent}
          >
            {`Create event`}
          </Button>
        </form>
        <ErrorMessage errorCode={error}></ErrorMessage>
      </div>
    </div>
  );
}

export default CreateEvent;
