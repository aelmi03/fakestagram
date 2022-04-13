import { render, screen } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import Theme from "../../../Themes/Theme";
import { ThemeProvider } from "styled-components";
import Comment from "../../../components/Main/Posts/Comment";
import { User } from "../../../features/user/userSlice";
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
const fakeTimestamp = {
  toDate: () => {},
} as Timestamp;
const fakeContent = "Wow what an awesome photo!!";
jest.mock("date-fns", () => {
  return { formatDistanceToNow: () => "2h" };
});
let mockNavigateFunction = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
describe("Comment component", () => {
  it("correctly renders based on the props", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Comment
          timestamp={fakeTimestamp}
          content={fakeContent}
          user={mockUser}
        />
      </ThemeProvider>
    );
    expect(screen.getByText(`${fakeContent}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser.username}`)).toBeInTheDocument();
    expect(
      (screen.getByAltText("comment profile") as HTMLImageElement).src
    ).toEqual(`http://localhost/${mockUser.profilePicture}`);
    expect(screen.getByText("2h ago")).toBeInTheDocument();
  });
  it("Will call the navigate function with the right path when the profile picture or username is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Comment
          timestamp={fakeTimestamp}
          content={fakeContent}
          user={mockUser}
        />
      </ThemeProvider>
    );
    expect(mockNavigateFunction).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByText(`${mockUser.username}`));
    expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    expect(mockNavigateFunction.mock.calls[0][0]).toEqual(
      `/profile/${mockUser.id}`
    );
    userEvent.click(screen.getByAltText(`comment profile`));
    expect(mockNavigateFunction).toHaveBeenCalledTimes(2);
    expect(mockNavigateFunction.mock.calls[1][0]).toEqual(
      `/profile/${mockUser.id}`
    );
  });
});
