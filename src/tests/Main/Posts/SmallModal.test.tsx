import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { ThemeProvider } from "styled-components";
import SmallModal from "../../../components/Main/Posts/SmallModal";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";

jest.mock("../../../components/Main/Posts/AddComment", () => {
  return () => <div>Add Comment Component</div>;
});

jest.mock("../../../components/Main/Posts/Comments", () => {
  return () => <div>Comments component</div>;
});
jest.mock("date-fns", () => {
  return {
    formatDistanceToNow: () => "2h ",
  };
});
const mockPost: Post = {
  postedBy: "randomID",
  comments: [],
  likes: [],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "fakePostID",
  imgSrc: "fakeImgSrc",
};
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
describe("Calls the prop function when the Back icon is clicked", () => {
  let changeModalStatus: jest.Mock;
  beforeEach(() => {
    changeModalStatus = jest.fn();
    render(
      <ThemeProvider theme={Theme}>
        <SmallModal
          post={mockPost}
          postUser={mockUser}
          changeModalStatus={changeModalStatus}
        />
      </ThemeProvider>
    );
  });
  it("renders the caption as a comment correctly with the correct username and caption content", () => {
    expect(screen.getByText("Went on a trip!")).toBeInTheDocument();
    expect(screen.getByText("johnDoe23")).toBeInTheDocument();
  });
  it("calls the changeModalStatus function when the Go Back icon is clicked in the ReturnBack component", () => {
    expect(changeModalStatus).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(changeModalStatus).toHaveBeenCalledTimes(1);
  });
});
