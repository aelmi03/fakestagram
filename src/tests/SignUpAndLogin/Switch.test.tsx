import Switch from "../../components/SignUpAndLogin/Switch";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import userEvent from "@testing-library/user-event";

describe("Switch component", () => {
  const onClick = jest.fn();
  it("Renders text telling the user to sign and a sign up link if the status is Log In", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Switch status="Log In" onClick={onClick} />
      </ThemeProvider>
    );
    expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
    expect(screen.queryByText(/Have an account?/)).not.toBeInTheDocument();
    expect(screen.getByTestId("form link")).toHaveTextContent("Sign up");
  });
  it("Renders text telling the user to log in and a log in link if the status is Sign Up", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Switch status="Sign Up" onClick={onClick} />
      </ThemeProvider>
    );
    expect(screen.getByText(/Have an account?/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Don't have an account?/)
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("form link")).toHaveTextContent("Log in");
  });
  it("Calls the callback passed into it when the link is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Switch status="Sign Up" onClick={onClick} />
      </ThemeProvider>
    );
    const formLink = screen.getByTestId("form link");
    userEvent.click(formLink);
    userEvent.click(formLink);
    expect(onClick).toHaveBeenCalledTimes(2);
    userEvent.click(formLink);
    userEvent.click(formLink);
    expect(onClick).toHaveBeenCalledTimes(4);
  });
});
