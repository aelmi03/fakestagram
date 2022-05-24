import { render, screen } from "@testing-library/react";
import Links from "../../../components/Main/Navbar/Links";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import { User } from "../../../features/user/userSlice";

let mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const toggleAddPostModal = jest.fn();
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(() => {
      return {
        currentUser: { uid: mockUser.id },
      };
    }),
  };
});
describe("Links Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <ThemeProvider theme={Theme}>
          <Links toggleAddPostModal={toggleAddPostModal} />
        </ThemeProvider>
      </Router>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("will call the toggleAddPostModal prop function when the Add Post Icon is clicked", () => {
    expect(toggleAddPostModal).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Add Post Icon"));
    expect(toggleAddPostModal).toHaveBeenCalledTimes(1);
  });
  it("will show the Filled home icon when the unfilled home icon is clicked, and will change the location pathname to /home", () => {
    expect(window.location.pathname).not.toBe("/home");
    expect(screen.getByTestId("Unfilled Home Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("Filled Home Icon")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("Home Link"));
    expect(screen.getByTestId("Filled Home Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("Unfilled Home Icon")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/home");
  });
  it("will show the Filled Explore icon when the unfilled explore icon is clicked, and will change the location pathname to /explore", () => {
    expect(window.location.pathname).not.toBe("/explore");
    expect(screen.getByTestId("Unfilled Explore Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("Filled Explore Icon")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("Explore Link"));
    expect(screen.getByTestId("Filled Explore Icon")).toBeInTheDocument();
    expect(
      screen.queryByTestId("Unfilled Explore Icon")
    ).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/explore");
  });
  it("will show the Filled Chats icon when the unfilled chats icon is clicked, and will change the location pathname to /chats", () => {
    expect(window.location.pathname).not.toBe("/chats");
    expect(screen.getByTestId("Unfilled Chats Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("Filled Chats Icon")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("Chats Link"));
    expect(screen.getByTestId("Filled Chats Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("Unfilled Chats Icon")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/chats");
  });
  it("will change the location pathname to /search, when the search icon is clicked", () => {
    expect(window.location.pathname).not.toBe("/search");
    userEvent.click(screen.getByTestId("Search Link"));
    expect(window.location.pathname).toBe("/search");
  });
  it("will show the Filled Profile Icon whne the unfilled profile icon is clicked, and will change the location pathname to /profile/<currentUserID>", () => {
    expect(window.location.pathname).not.toBe(`/profile/${mockUser.id}`);
    expect(screen.getByTestId("Unfilled Profile Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("Filled Profile Icon")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("Profile Link"));
    expect(screen.getByTestId("Filled Profile Icon")).toBeInTheDocument();
    expect(
      screen.queryByTestId("Unfilled Profile Icon")
    ).not.toBeInTheDocument();
    expect(window.location.pathname).toBe(`/profile/${mockUser.id}`);
  });
});
