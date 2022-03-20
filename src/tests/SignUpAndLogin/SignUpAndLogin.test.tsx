import SignUpAndLogin from "../../components/SignUpAndLogin";
import { act, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import { store } from "../../app/store";
import { Provider } from "react-redux";
beforeEach(() => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <SignUpAndLogin />
      </ThemeProvider>
    </Provider>
  );
});
describe("SignUpAndLogin component", () => {
  it("renders the Login Component and the Switch component first", () => {
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
  it("is able to to successfully go from the Login page to the Signup page and back to the Signup page", () => {
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    userEvent.click(screen.getByText("Sign up"));
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByText("Have an account?")).toBeInTheDocument();
    userEvent.click(screen.getByText("Log in"));
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });
});
