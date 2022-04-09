import { render, screen } from "@testing-library/react";
import Theme from "../../../../Themes/Theme";
import { ThemeProvider } from "styled-components";
import SearchResult from "../../../../components/Main/Navbar/Search/SearchResult";
import { User } from "../../../../features/user/userSlice";
import userEvent from "@testing-library/user-event";

const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "123",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
describe("SearchResult Component", () => {
  let onSearchResultClick: jest.Mock;
  let onDeleteIconClick: jest.Mock;

  beforeEach(() => {
    onSearchResultClick = jest.fn();
    onDeleteIconClick = jest.fn();
  });
  it("Shows the correct username, full name, and profile picture based on the user prop passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <SearchResult
          user={mockUser}
          onSearchResultClick={onSearchResultClick}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("johnDoe23")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      (screen.getByAltText("Profile Picture") as HTMLImageElement).src
    ).toEqual(`http://localhost/${mockUser.profilePicture}`);
  });
  it("it doesn't render the delete icon if the onDeleteIconClick function isn't passed in as a prop", () => {
    render(
      <ThemeProvider theme={Theme}>
        <SearchResult
          user={mockUser}
          onSearchResultClick={onSearchResultClick}
        />
      </ThemeProvider>
    );
    expect(screen.queryByTestId("Delete Icon")).not.toBeInTheDocument();
  });
  it("it will render the delete icon if the onDeleteIconClick function is passed in as a prop", () => {
    render(
      <ThemeProvider theme={Theme}>
        <SearchResult
          user={mockUser}
          onSearchResultClick={onSearchResultClick}
          onDeleteIconClick={onDeleteIconClick}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Delete Icon")).toBeInTheDocument();
  });
  it("will call the onSearchResultClick function with the user prop passed in when it is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <SearchResult
          user={mockUser}
          onSearchResultClick={onSearchResultClick}
        />
      </ThemeProvider>
    );
    expect(onSearchResultClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("SearchResult Container"));
    expect(onSearchResultClick).toHaveBeenCalledTimes(1);
    expect(onSearchResultClick.mock.calls[0][0]).toEqual(mockUser);
  });
  it("will call the onDeleteIconClick function with the user prop passed in when the delete icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <SearchResult
          user={mockUser}
          onSearchResultClick={onSearchResultClick}
          onDeleteIconClick={onDeleteIconClick}
        />
      </ThemeProvider>
    );
    expect(onDeleteIconClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Delete Icon"));
    expect(onDeleteIconClick).toHaveBeenCalledTimes(1);
    expect(onDeleteIconClick.mock.calls[0][0]).toEqual(mockUser);
  });
});
