import { render, screen } from "@testing-library/react";
import App from "../App";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { User } from "../features/user/userSlice";

let mockAuthUserValue: null | string;
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "123",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(),
  };
});
jest.mock("react-firebase-hooks/auth", () => {
  return {
    useAuthState: () => {
      return [mockAuthUserValue];
    },
  };
});
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    doc: jest.fn(),
    onSnapshot: jest.fn(),
    getDoc: async () => {
      return {
        data: () => mockUser,
      };
    },
  };
});
jest.mock("../components/Main", () => {
  return () => <div>The Main component is rendered</div>;
});
jest.mock("../components/SignUpAndLogin", () => {
  return () => <div>The SignUpAndLogin component is rendered</div>;
});
describe("App component", () => {
  it("renders the Signup page if the useAuthState returns null", () => {
    mockAuthUserValue = null;
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByText(/The SignUpAndLogin component is rendered/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/The Main component is rendered/)
    ).not.toBeInTheDocument();
  });
  it("renders the Main page if the useAuthState doesn't return null", () => {
    mockAuthUserValue = "value is not null";
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByText(/The Main component is rendered/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/The SignUpAndLogin component is rendered/)
    ).not.toBeInTheDocument();
  });
  it("Sets the user in the redux store if the useAuthState doesn't return null", async () => {
    mockAuthUserValue = "value is not null";
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(store.getState().user).toEqual(mockUser);
  });
});
