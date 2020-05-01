import React, { useContext } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useTranslation } from "react-i18next";
import { store } from "../../store.js";
import "./JoinEvent.css";

function JoinEvent(props) {
  const { addUser, error } = useContext(store);
  const { t } = useTranslation("translation");
  const { palette } = useTheme();
  const theme = {
    container: { background: palette.background.default },
    modal: { background: palette.primary.main },
  };

  function addNewUser(e) {
    e.preventDefault();
    const userName = document.addUserForm.userName.value;
    const eventPassword = document.addUserForm.eventPassword.value;
    addUser({ userName, eventPassword });
  }

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
