import { useAppSelector } from "../../../app/hooks";
import { doc, getFirestore, onSnapshot, Timestamp } from "firebase/firestore";
import { deletePost } from "../../../components/utils/utilityFunctions";
import StandardPost from "../../../components/Main/Posts/StandardPost";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { User } from "../../../features/user/userSlice";
import Post from "../../../components/utils/PostInterface";

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
jest.mock("date-fns", () => {
  return { formatDistanceToNow: () => "2h" };
});
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    doc: jest.fn(),
    onSnapshot: jest.fn(() => {
      return () => {};
    }),
  };
});
jest.mock("../../../components/Main/Posts/PostModal", () => {
  return () => <div>Post Modal Component</div>;
});
jest.mock("../../../components/Main/Posts/AddComment", () => {
  return () => <div>Add Comment Component</div>;
});
jest.mock("../../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../../components/utils/utilityFunctions"),
    checkEquality: jest.fn(),
    clickBookmarkIcon: jest.fn(),
    clickLikeIcon: jest.fn(),
    deletePost: jest.fn(),
  };
});
jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});
describe("StandardPost Component", () => {
  let changePostToShow: jest.Mock;
  let isOnHomePosts: boolean;
  beforeEach(() => {
    changePostToShow = jest.fn((post: Post | null) => {});
    isOnHomePosts = false;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is able to show the delete button when the three dots svg icon is clicked, and calls the deletePost function when it's clicked and is able to make it go away when the user clicks away from it", () => {
    render(
      <ThemeProvider theme={Theme}>
        <StandardPost
          post={mockPost}
          isOnHomePosts={isOnHomePosts}
          postUser={mockUser}
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
});
