/// <reference types="react-scripts" />

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
      neutral: string;
    };
    primaryFont: string;
  }
}
