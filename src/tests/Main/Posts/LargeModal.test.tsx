import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { ThemeProvider } from "styled-components";
import { deletePost } from "../../../components/utils/utilityFunctions";
import LargeModal from "../../../components/Main/Posts/LargeModal";
import Post from "../../../components/utils/PostInterface";
import AddComment from "../../../components/Main/Posts/AddComment";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";

let mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockPost: Post = {
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

type fakeComment = { content: string };
jest.mock("date-fns", () => {
  return { formatDistanceToNow: () => "2h" };
});
jest.mock("../../../components/Main/Posts/Comment", () => {
  return ({ user, content }: { user: User; content: string }) => (
    <div>
      <h1>{user.username}</h1> <h1>{content}</h1>
    </div>
  );
});
jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});
jest.mock("../../../components/Main/Posts/Comments", () => {
  return () => <div>Comments Component</div>;
});
jest.mock("../../../components/Main/Posts/Comment", () => {
  return ({ content }: fakeComment) => <div>{content}</div>;
});
jest.mock("../../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../../components/utils/utilityFunctions"),
    deletePost: jest.fn(),
  };
});
describe("Large Modal component", () => {
  let changeModalStatus: jest.Mock;
  let changePostToShow: jest.Mock;

  beforeEach(() => {
    changeModalStatus = jest.fn();
    changePostToShow = jest.fn((post: Post | null) => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a comment using the the content of the caption", () => {
    render(
      <ThemeProvider theme={Theme}>
        <LargeModal
          post={mockPost}
          postUser={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("Went on a trip!")).toBeInTheDocument();
  });
  it("is able to show the delete button when the three dots svg icon is clicked, and calls the deletePost function when it's clicked and is able to make it go away when the user clicks away from it", () => {
    render(
      <ThemeProvider theme={Theme}>
        <LargeModal
          post={mockPost}
          postUser={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.queryByTestId("Delete Post Button")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("three dots"));
    expect(screen.getByTestId("Delete Post Button")).toBeInTheDocument();
    expect(deletePost).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Delete Post Button"));
    expect(deletePost).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("Delete Post Button")).not.toBeInTheDocument();
  });
  it("calls the changeModalStatus function if the changePostToShow function is not passed as a prop", () => {
    render(
      <ThemeProvider theme={Theme}>
        <LargeModal
          post={mockPost}
          postUser={mockUser}
          changeModalStatus={changeModalStatus}
        />
      </ThemeProvider>
    );
    expect(changeModalStatus).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Large Modal Wrapper"));
    expect(changeModalStatus).toHaveBeenCalledTimes(1);
    expect(changePostToShow).toHaveBeenCalledTimes(0);
  });
  it("calls the changePostToShow function if the changePostToShow function is  passed as a prop", () => {
    render(
      <ThemeProvider theme={Theme}>
        <LargeModal
          post={mockPost}
          postUser={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(changePostToShow).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Large Modal Wrapper"));
    expect(changePostToShow).toHaveBeenCalledTimes(1);
    expect(changeModalStatus).toHaveBeenCalledTimes(0);
  });
});
