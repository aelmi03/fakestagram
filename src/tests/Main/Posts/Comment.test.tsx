import { render, screen } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import Theme from "../../../Themes/Theme";
import { ThemeProvider } from "styled-components";
import Comment from "../../../components/Main/Posts/Comment";
import { User } from "../../../features/user/userSlice";
jest.mock("date-fns", () => {
  return { formatDistanceToNow: () => "2h" };
});
describe("Comment component", () => {
  it("correctly renders based on the props", () => {
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
});
