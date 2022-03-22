import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import Signup from "../../components/SignUpAndLogin/Signup";
import { store } from "../../app/store";
import { Provider } from "react-redux";

let mockEmailAlreadyExists = false;
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: async () => {
      if (mockEmailAlreadyExists) {
        return Promise.reject();
      }
      return {
        user: {
          uid: "123",
        },
      };
    },
  };
});
let mockNumberOfPeopleWithThatUsername = 0;
jest.mock("firebase/firestore", () => {
  return {
    query: jest.fn(),
    collection: jest.fn(),
    getDocs: async () => {
      return {
        docs: {
          length: mockNumberOfPeopleWithThatUsername,
        },
      };
    },
    getFirestore: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
  };
});

describe("Sign up component", () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Signup />
        </Provider>
      </ThemeProvider>
    );
    mockNumberOfPeopleWithThatUsername = 0;
    mockEmailAlreadyExists = false;
  });
  it("The sign up button is disabled until the form is properly filled out", () => {
    const signUpButton = screen.getByRole("button", { name: "Sign up" });
    const emailInput = screen.getByLabelText("Email Address");
    const fullNameInput = screen.getByLabelText("Full Name");
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText(
      "Password (minimum of 6 characters)"
    );
    expect(signUpButton).toBeDisabled();
    userEvent.type(emailInput, "johndoegmail.com");
    userEvent.type(fullNameInput, "John Doe");
    userEvent.type(usernameInput, "johnDoe23");
    userEvent.type(passwordInput, "johndoe1234");
    expect(signUpButton).toBeDisabled();
    userEvent.clear(emailInput);
    userEvent.type(emailInput, "johndoe@gmail.com");
    expect(signUpButton).not.toBeDisabled();
  });
  it("The user will see a warning text if they try to sign up with a username that is already linked to an account ", async () => {
    const signUpButton = screen.getByRole("button", { name: "Sign up" });
    const emailInput = screen.getByLabelText("Email Address");
    const fullNameInput = screen.getByLabelText("Full Name");
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText(
      "Password (minimum of 6 characters)"
    );

    userEvent.type(emailInput, "johndoe@gmail.com");
    userEvent.type(fullNameInput, "John Doe");
    userEvent.type(usernameInput, "johnDoe23");
    userEvent.type(passwordInput, "johndoe24");
    await act(async () => {
      userEvent.click(signUpButton);
    });
    expect(
      screen.queryByText(/Username is taken, please choose another one/i)
    ).not.toBeInTheDocument();
    mockNumberOfPeopleWithThatUsername = 1;

    await act(async () => {
      userEvent.click(signUpButton);
    });
    expect(
      screen.getByText(/Username is taken, please choose another one/i)
    ).toBeInTheDocument();
  });
  it("If the user enters an email that is taken they will see text telling them to choose a different email.", async () => {
    const signUpButton = screen.getByRole("button", { name: "Sign up" });
    const emailInput = screen.getByLabelText("Email Address");
    const fullNameInput = screen.getByLabelText("Full Name");
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText(
      "Password (minimum of 6 characters)"
    );
    mockEmailAlreadyExists = false;
    userEvent.type(emailInput, "johndoe@gmail.com");
    userEvent.type(fullNameInput, "John Doe");
    userEvent.type(usernameInput, "johnDoe23");
    userEvent.type(passwordInput, "johndoe24");
    await act(async () => {
      userEvent.click(signUpButton);
    });

    expect(
      screen.queryByText(
        /Email address is already associated with a fakestagram account/i
      )
    ).not.toBeInTheDocument();

    mockEmailAlreadyExists = true;
    await act(async () => {
      userEvent.click(signUpButton);
    });
    expect(
      screen.getByText(
        /Email address is already associated with a fakestagram account/i
      )
    ).toBeInTheDocument();
  });
});
