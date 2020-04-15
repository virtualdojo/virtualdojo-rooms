import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import * as FirestoreService from "../../services/firestore";
import { useTranslation } from "react-i18next";
import "./JoinEvent.css";

function JoinEvent(props) {
  const { event, onSelectUser, userId } = props;
  const { t } = useTranslation("translation");

  const [error, setError] = useState();
  const { palette } = useTheme();

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

  const theme = {
    container: { background: palette.background.default },
    modal: { background: palette.primary.main },
  };

  return (
    <div className={"Join-container"} style={theme.container}>
      <Typography
        variant="h3"
        align="center"
        color="primary"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        VirtualDojo Rooms
      </Typography>
      <div className={"Join-modal"} style={theme.modal}>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
          style={{ marginBottom: "15px" }}
        >
          {t("Join Dojo")}!
        </Typography>
        <form name="addUserForm" className={"Join-form-container"}>
          <TextField
            label={t("Full Name")}
            name="userName"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label={t("Event Password")}
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
            onClick={addNewUser}
          >
            {t("Submit")}
          </Button>
        </form>
        <ErrorMessage errorCode={error}></ErrorMessage>
      </div>
    </div>
  );
}

export default JoinEvent;
