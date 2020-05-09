import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import { StateProvider } from "./store.js";
import { theme } from "./components/Theme/Theme";

import App from "./App";
function Root() {
  return (
    <DndProvider backend={Backend}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StateProvider>
          <App />
        </StateProvider>
      </ThemeProvider>
    </DndProvider>
  );
}

export default Root;
