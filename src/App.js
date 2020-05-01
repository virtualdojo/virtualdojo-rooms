import React, { useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import * as LoggerService from "./services/logger";
import { store } from "./store.js";

import CreateEvent from "./containers/CreateEvent/CreateEvent";
import JoinEvent from "./containers/JoinEvent/JoinEvent";
import Event from "./containers/Event/Event";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";

function App() {
  const { currentUser, event, isLoading, error, isInitializing } = useContext(
    store
  );
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
      </div>
    );
  if (event && currentUser) {
    return (
      <DndProvider backend={Backend}>
        <div style={theme.container}>
          <Event user={currentUser} event={event} />
        </div>
      </DndProvider>
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
