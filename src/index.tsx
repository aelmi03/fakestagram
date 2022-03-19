import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./Themes/GlobalStyle";
import Theme from "./Themes/Theme";
import "./firebase";
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// Learn more about service workers: https://bit.ly/CRA-PWA
