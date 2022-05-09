import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import ReturnBack from "../../components/utils/ReturnBack";
import { User } from "../../features/user/userSlice";
import Theme from "../../Themes/Theme";

let onChatIconClick: jest.Mock;
let onChatAccountClicked: jest.Mock;
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
let onClick: jest.Mock;
describe("ReturnBack Component", () => {
  beforeEach(() => {
    onClick = jest.fn();
    onChatIconClick = jest.fn();
    onChatAccountClicked = jest.fn();
  });

  it("will display a name using the value from the name string prop", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack onClick={onClick} name="Testing" />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Name")).toHaveTextContent("Testing");
  });
  it("will call the onClick function prop when the Go Back icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack onClick={onClick} name="Testing" />
      </ThemeProvider>
    );
    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it("will call the onClick function prop when the Go Back icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack onClick={onClick} name="Testing" />
      </ThemeProvider>
    );
    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("will not render the Profile Picture and Username Container if a user prop is passed in but not the onChatAccountClicked prop function", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack onClick={onClick} name="Testing" user={mockUser} />
      </ThemeProvider>
    );
    expect(
      screen.queryByTestId("Profile Picture and Username Container")
    ).not.toBeInTheDocument();
  });
  it("will not render the Profile Picture and Username Container if a onChatAccountClicked function prop  is passed in but not the user prop", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack
          onClick={onClick}
          name="Testing"
          onChatAccountClicked={onChatAccountClicked}
        />
      </ThemeProvider>
    );
    expect(
      screen.queryByTestId("Profile Picture and Username Container")
    ).not.toBeInTheDocument();
  });
  it("will render the Profile Picture and Username Container if the onChatAccountClicked and user props are passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack
          onClick={onClick}
          name="Testing"
          user={mockUser}
          onChatAccountClicked={onChatAccountClicked}
        />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId("Profile Picture and Username Container")
    ).toBeInTheDocument();
  });
  it("will call the onChatAccountClicked prop function with the user passed in if the Profile Picture and Username Container is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack
          onClick={onClick}
          name="Testing"
          user={mockUser}
          onChatAccountClicked={onChatAccountClicked}
        />
      </ThemeProvider>
    );
    expect(onChatAccountClicked).toHaveBeenCalledTimes(0);
    userEvent.click(
      screen.getByTestId("Profile Picture and Username Container")
    );
    expect(onChatAccountClicked).toHaveBeenCalledTimes(1);
    expect(onChatAccountClicked.mock.calls[0][0]).toBe(mockUser);
  });
  it("will render the Chat Icon if the onChatIconClick prop function is passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack
          onClick={onClick}
          name="Testing"
          onChatIconClick={onChatIconClick}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Chat Icon")).toBeInTheDocument();
  });
  it("will not render the Chat Icon if the onChatIconClick prop function is not passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack onClick={onClick} name="Testing" />
      </ThemeProvider>
    );
    expect(screen.queryByTestId("Chat Icon")).not.toBeInTheDocument();
  });
  it("will call the onChatIconClick prop function if the Chat Icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ReturnBack
          onClick={onClick}
          name="Testing"
          onChatIconClick={onChatIconClick}
        />
      </ThemeProvider>
    );
    expect(onChatIconClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Chat Icon"));
    expect(onChatIconClick).toHaveBeenCalledTimes(1);
  });
});
