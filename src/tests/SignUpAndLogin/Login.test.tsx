import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import Login from "../../components/SignUpAndLogin/Login";
import { store } from "../../app/store";
import { Provider } from "react-redux";
import { User } from "../../features/user/userSlice";
import {
  signInWithEmailAndPassword,
  getAuth,
  User as AuthUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
let mockEmailAddressDoesNotExist: boolean;
let mockPasswordIsIncorrect: boolean;
let mockUser: User;
jest.mock("firebase/auth", () => {
  return {
    signInWithEmailAndPassword: async () => {
      if (!mockEmailAddressDoesNotExist && !mockPasswordIsIncorrect) {
        return {
          user: {
            uid: "123",
          },
        };
      } else {
        if (mockEmailAddressDoesNotExist) {
          return Promise.reject({
            message: "(auth/user-not-found).",
          });
        } else {
          return Promise.reject({
            message: "(auth/password-is-inccorect)",
          });
        }
      }
    },
    getAuth: jest.fn(),
    User: jest.requireActual("firebase/auth").User,
  };
});
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    getDoc: async () => {
      return {
        data: () => mockUser,
      };
    },
    doc: jest.fn(),
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
  mockEmailAddressDoesNotExist = false;
  mockPasswordIsIncorrect = false;
});
describe("Login component", () => {
  it.skip("The login button is disabled until the form is properly filled out", async () => {
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
  it.skip("The user will see text telling them the email address doesn't exist if they enter a email address not linked to an account", async () => {
    const logInButton = screen.getByRole("button", { name: "Log in" });
    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText(
      "Password (minimum of 6 characters)"
    );
    userEvent.type(emailInput, "johndoe@gmail.com");
    userEvent.type(passwordInput, "johndoe123");
    await act(async () => {
      userEvent.click(logInButton);
    });
    expect(
      screen.queryByText(
        "The email address you entered doesn't belong to an account. Please check your email address and try again."
      )
    ).not.toBeInTheDocument();
    mockEmailAddressDoesNotExist = true;
    await act(async () => {
      userEvent.click(logInButton);
    });
    expect(
      screen.getByText(
        "The email address you entered doesn't belong to an account. Please check your email address and try again."
      )
    ).toBeInTheDocument();
  });
  it("The user will see warning text telling them that the password they entered is incorrect if the email address is linked to an account but the password is wrong", async () => {
    const logInButton = screen.getByRole("button", { name: "Log in" });
    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText(
      "Password (minimum of 6 characters)"
    );
    userEvent.type(emailInput, "johndoe@gmail.com");
    userEvent.type(passwordInput, "johndoe123");
    await act(async () => {
      userEvent.click(logInButton);
    });
    expect(
      screen.queryByText(
        "Sorry, your password was incorrect. Please double-check your password."
      )
    ).not.toBeInTheDocument();
    mockPasswordIsIncorrect = true;
    await act(async () => {
      userEvent.click(logInButton);
    });
    expect(
      screen.getByText(
        "Sorry, your password was incorrect. Please double-check your password."
      )
    ).toBeInTheDocument();
  });
});
