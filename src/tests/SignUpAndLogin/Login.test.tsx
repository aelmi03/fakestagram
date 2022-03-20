import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import Login from "../../components/SignUpAndLogin/Login";
import { store } from "../../app/store";
import { Provider } from "react-redux";
import {
  signInWithEmailAndPassword,
  getAuth,
  User as AuthUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
jest.mock("firebase/auth", () => {
  return {
    signInWithEmailAndPassword: jest.fn(),
    getAuth: jest.fn(),
    User: jest.requireActual("firebase/auth").User,
  };
});
beforeEach(() => {
  render(
    <ThemeProvider theme={Theme}>
      <Provider store={store}>
        <Login />
      </Provider>
    </ThemeProvider>
  );
});
describe("Login component", () => {
  it("The login button is disabled until the form is properly filled out", async () => {
    const logInButton = screen.getByRole("button", { name: "Log in" });
    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText(
      "Password (minimum of 6 characters)"
    );
    expect(logInButton).toBeDisabled();
    userEvent.type(emailInput, "johnnydoe@gmail.com");
    expect(logInButton).toBeDisabled();
    userEvent.type(passwordInput, "johnnydoe123456");
    expect(logInButton).not.toBeDisabled();
    userEvent.clear(passwordInput);
    expect(logInButton).toBeDisabled();
    userEvent.type(passwordInput, "johnnydoe123456");
    expect(logInButton).not.toBeDisabled();
    userEvent.clear(emailInput);
    userEvent.type(emailInput, "johngmail.com");
    expect(logInButton).toBeDisabled();
    userEvent.clear(emailInput);
    userEvent.type(emailInput, "john@gmail.com");
    expect(logInButton).not.toBeDisabled();
    userEvent.clear(passwordInput);
    expect(logInButton).toBeDisabled();
  });
});
