import SignUpAndLogin from ".././components/SignUpAndLogin/";
import { render, screen, act } from "@testing-library/react";
import App from "../App";

let mockAuthUserValue: null | string;
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
jest.mock("../components/Main", () => {
  return () => <div>The Main component is rendered</div>;
});
jest.mock("../components/SignUpAndLogin", () => {
  return () => <div>The SignUpAndLogin component is rendered</div>;
});
describe("App component", () => {
  it("renders the Signup page if the useAuthState returns null", () => {
    mockAuthUserValue = null;
    render(<App />);
    expect(
      screen.getByText(/The SignUpAndLogin component is rendered/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/The Main component is rendered/)
    ).not.toBeInTheDocument();
  });
  it("renders the Signup page if the useAuthState returns null", () => {
    mockAuthUserValue = "value is not null";
    render(<App />);
    expect(
      screen.getByText(/The Main component is rendered/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/The SignUpAndLogin component is rendered/)
    ).not.toBeInTheDocument();
  });
});
