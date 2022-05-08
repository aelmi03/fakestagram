import Main from "../../components/Main";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
jest.mock("../../components/Main/Profile", () => {
  return () => <div>Profile Component</div>;
});
jest.mock("../../components/Main/Messages", () => {
  return () => <div>Messages Component</div>;
});
jest.mock("../../components/Main/Home", () => {
  return () => <div>Home Component</div>;
});
jest.mock("../../components/Main/Explore", () => {
  return () => <div>Explore Component</div>;
});
jest.mock("../../components/Main/Navbar", () => {
  return () => <div>Navbar Component</div>;
});
jest.mock("../../components/Main/Navbar/Search", () => {
  return () => <div>Search Component</div>;
});
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    BrowserRouter: ({ children }: any) => <div>{children}</div>,
  };
});
describe("Main Component", () => {
  afterAll(() => {});
  it("should only render the Navbar if there is no Route that matches", () => {
    render(
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={["/"]}>
          <Main />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText("Navbar Component")).toBeInTheDocument();
    expect(screen.queryByText("Profile Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Home Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Messages Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Search Component")).not.toBeInTheDocument();
  });
  it("should render the Home Component and the Navbar Component if the path is /home", () => {
    render(
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={["/home"]}>
          <Main />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText("Home Component")).toBeInTheDocument();
    expect(screen.getByText("Navbar Component")).toBeInTheDocument();
    expect(screen.queryByText("Profile Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Messages Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Search Component")).not.toBeInTheDocument();
  });
  it("should render the Profile Component and the Navbar component if the path is /profile/:userID", () => {
    render(
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={["/profile/userID"]}>
          <Main />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText("Profile Component")).toBeInTheDocument();
    expect(screen.getByText("Navbar Component")).toBeInTheDocument();
    expect(screen.queryByText("Home Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Messages Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Search Component")).not.toBeInTheDocument();
  });
  it("should render the Messages Component and the Navbar component if the path is /chats", () => {
    render(
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={["/chats"]}>
          <Main />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText("Messages Component")).toBeInTheDocument();
    expect(screen.getByText("Navbar Component")).toBeInTheDocument();
    expect(screen.queryByText("Profile Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Home Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Search Component")).not.toBeInTheDocument();
  });
  it("should render the Explore Component and the Navbar component if the path is /explore", () => {
    render(
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={["/explore"]}>
          <Main />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText("Explore Component")).toBeInTheDocument();
    expect(screen.getByText("Navbar Component")).toBeInTheDocument();
    expect(screen.queryByText("Messages Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Profile Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Home Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Search Component")).not.toBeInTheDocument();
  });
  it("should render the Search Component and the Navbar component if the path is /search", () => {
    render(
      <ThemeProvider theme={Theme}>
        <MemoryRouter initialEntries={["/search"]}>
          <Main />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText("Search Component")).toBeInTheDocument();
    expect(screen.getByText("Navbar Component")).toBeInTheDocument();
    expect(screen.queryByText("Explore Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Messages Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Profile Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Home Component")).not.toBeInTheDocument();
  });
});
