import { createMuiTheme } from "@material-ui/core/styles";

const palette = {
  common: {
    black: "#000",
    white: "#fff",
  },
  background: {
    paper: "#fff",
    default: "#fff",
  },
  primary: {
    light: "#baffff",
    main: "#84ffff",
    dark: "#219ec3",
    contrastText: "#0d47a1",
  },
  secondary: {
    light: "#ffffbf",
    main: "#ffff8d",
    dark: "#ff8e00",
    contrastText: "#0d47a1",
  },
  error: {
    light: "#ff5000",
    main: "#e57373",
    dark: "#d32f2F",
    contrastText: "#fff",
  },
  text: {
    primary: "#0d47a1",
    secondary: "#01579B",
    disabled: "#9e9e9E",
    hint: "#4a4a4A",
  },
};

const typography = {
  fontFamily: "Comic Neue, Helvetica, Verdana",
};

const theme = createMuiTheme({
  palette,
  typography,
});

export { theme, palette };
