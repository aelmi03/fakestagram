import { DefaultTheme } from "styled-components";

const Theme: DefaultTheme = {
  palette: {
    primary: {
      main: "#fafafa",
      contrastText: "#000000",
    },
    primaryLight: "#ffffff",
    secondary: {
      main: "#0095f6",
      contrastText: "#FFFFFF",
    },
    common: {
      white: "#FFFFFF",
      black: "#000000",
      grey: "#dbdbdb",
    },
    neutral: "#efefef",
    darkGrey: "#8E8E8E",
    lightRed: "#ed4956",
  },
  primaryFont: `Montserrat, sans-serif`,
};

export default Theme;
