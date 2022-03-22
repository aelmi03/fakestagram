/// <reference types="react-scripts" />
import "styled-components";

interface IPallette {
  main: string;
  contrastText: string;
}
declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      primary: IPallette;
      secondary: IPallette;
      lightRed: string;
      primaryLight: string;
      darkGrey: string;
      neutral: string;
      common: {
        black: string;
        white: string;
        grey: string;
      };
    };
    primaryFont: string;
  }
}
