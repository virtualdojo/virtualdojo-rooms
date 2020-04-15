import React, { Suspense } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { StateProvider } from "./store.js";
import { theme } from "./components/Theme/Theme";

import App from "./App";
function Root() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StateProvider>
        <Suspense>
          <App />
        </Suspense>
      </StateProvider>
    </ThemeProvider>
  );
}

export default Root;
