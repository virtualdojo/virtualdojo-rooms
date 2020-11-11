import React, { useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Typography, Button, Paper } from "@material-ui/core";
import { isMobile, isChrome } from "react-device-detect";
import { Trans, useTranslation } from "react-i18next";

import { store, CONSTANTS } from "./store.js";

import CreateEvent from "./containers/CreateEvent/CreateEvent";
import JoinEvent from "./containers/JoinEvent/JoinEvent";
import Event from "./containers/Event/Event";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";

function UnsupportedCheck() {
  const { setForcedView } = useContext(store);
  const { palette } = useTheme();
  const { t } = useTranslation("translation");
  const theme = {
    container: {
      display: "flex",
      background: palette.primary.main,
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      overflowY: "auto",
    },
  };
  return (
    <div style={theme.container}>
      <Paper
        variant="outlined"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom={true}>
          {t("Unsupported browser title")}
        </Typography>
        <Typography variant="h6" gutterBottom={true} align={"center"}>
          <Trans t={t} i18nKey="Unsupported browser description"></Trans>
        </Typography>

        <Trans t={t} i18nKey="Unsupported browser help">
          Unsupported browser help
          <Typography variant="subtitle1">Unsupported browser help</Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ fontWeight: 600 }}
            type="submit"
            onClick={() =>
              window.open("https://www.google.com/chrome/", "_blank")
            }
            disabled={false}
          >
            "download"
          </Button>
          <Typography variant="body2">Unsupported browser help</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ fontWeight: 600 }}
            type="submit"
            onClick={() => setForcedView(CONSTANTS.ADVANCED_VIEW)}
            disabled={false}
          >
            "advanced"
          </Button>
        </Trans>
      </Paper>
    </div>
  );
}

function App() {
  const {
    currentUser,
    event,
    isLoading,
    error,
    isInitializing,
    forcedView,
  } = useContext(store);
  const { palette } = useTheme();
  const theme = {
    container: {
      background: palette.primary.main,
      width: "100%",
      height: "100vh",
    },
  };

  if (isInitializing || isLoading)
    return (
      <div
        style={{
          ...theme.container,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          color="secondary"
          style={{ marginBottom: "80px" }}
        >
          VirtualDojo Rooms
        </Typography>
        <Typography
          variant="h6"
          color="secondary"
          style={{ marginBottom: "80px" }}
        >
          {isInitializing ? "Authentication..." : "Loading Event..."}
        </Typography>
        {error && <ErrorMessage errorCode={error}></ErrorMessage>}
      </div>
    );
  if ((isMobile || !isChrome) && !forcedView) {
    return <UnsupportedCheck />;
  }
  if (event && currentUser) {
    return (
      <div style={theme.container}>
        <Event user={currentUser} event={event} />
      </div>
    );
  } else if (event) {
    return (
      <div style={theme.container}>
        <JoinEvent />
      </div>
    );
  }
  return (
    <div style={theme.container}>
      <CreateEvent />
    </div>
  );
}

export default App;
