import React, { useContext } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useTranslation } from "react-i18next";
import { store } from "../../store.js";
import "./CreateEvent.css";

function CreateEvent(props) {
  const { createEvent, error } = useContext(store);
  const { t } = useTranslation("translation");
  const { palette } = useTheme();

  async function create(e) {
    e.preventDefault();

    const eventName = document.createListForm.eventName.value;
    const userName = `${document.createListForm.firstName.value} ${document.createListForm.lastName.value}`;
    const eventPassword = document.createListForm.eventPassword.value;
    const mentorPassword = document.createListForm.mentorPassword.value;

    createEvent({
      eventName,
      eventPassword,
      mentorPassword,
      userName,
    });
  }

  const theme = {
    container: { background: palette.background.default },
    modal: { background: palette.primary.main },
  };

  return (
    <div className={"Create-container"} style={theme.container}>
      <Typography
        variant="h3"
        color="primary"
        align="center"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        VirtualDojo Rooms
      </Typography>
      <div className={"Create-modal"} style={theme.modal}>
        <Typography
          variant="h5"
          color="secondary"
          align="center"
          style={{ marginBottom: "15px" }}
        >
          {t("Fill In Form")}!
        </Typography>
        <form name="createListForm" className={"Create-form-container"}>
          <TextField
            label={t("First Name")}
            name="firstName"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label={t("Last Name")}
            name="lastName"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label={t("Event Name")}
            name="eventName"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label={t("Users Password")}
            name="eventPassword"
            variant="filled"
            color="primary"
            style={{ marginBottom: "20px", backgroundColor: "white" }}
          />
          <TextField
            label={t("Mentors Password")}
            name="mentorPassword"
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
            onClick={create}
          >
            {t("Submit")}
          </Button>
        </form>
        <ErrorMessage errorCode={error}></ErrorMessage>
      </div>
    </div>
  );
}

export default CreateEvent;
