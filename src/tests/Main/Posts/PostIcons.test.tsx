import {
  clickBookmarkIcon,
  clickLikeIcon,
} from "../../../components/utils/utilityFunctions";
import { ThemeProvider } from "styled-components";
import PostIcons from "../../../components/Main/Posts/PostIcons";
import Theme from "../../../Themes/Theme";
import { Timestamp } from "firebase/firestore";
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
jest.mock("../../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../../components/utils/utilityFunctions"),
    clickBookmarkIcon: jest.fn(),
    clickLikeIcon: jest.fn(),
    deletePost: jest.fn(),
  };
});
describe("PostIcons Component", () => {
  let changeModalStatus: jest.Mock;
  let changePostToShow: jest.Mock;

  beforeEach(() => {
    changeModalStatus = jest.fn();
    changePostToShow = jest.fn((post: Post | null) => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders a filled heart if the user has liked the post and calls the clickLikeIcon function when clicked", () => {
    mockPost.likes = ["fakeUserID"];
    render(
      <ThemeProvider theme={Theme}>
        <PostIcons
          post={mockPost}
          user={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("filled-heart")).toBeInTheDocument();
    expect(screen.queryByTestId("heart")).not.toBeInTheDocument();
    expect(clickLikeIcon).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("filled-heart"));
    expect(clickLikeIcon).toHaveBeenCalledTimes(1);
  });

  it("renders an unfilled heart if the user hasn't liked the post and calls the clickLikeIcon function when clicked", () => {
    mockPost.likes = [];
    render(
      <ThemeProvider theme={Theme}>
        <PostIcons
          post={mockPost}
          user={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("heart")).toBeInTheDocument();
    expect(screen.queryByTestId("filled-heart")).not.toBeInTheDocument();
    expect(clickLikeIcon).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("heart"));
    expect(clickLikeIcon).toHaveBeenCalledTimes(1);
  });
  it("renders a filled bookmark if the user has saved the post and calls the clickBookmark function when clicked", () => {
    mockUser.savedPosts = ["fakePostID"];
    render(
      <ThemeProvider theme={Theme}>
        <PostIcons
          post={mockPost}
          user={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("filled-bookmark")).toBeInTheDocument();
    expect(screen.queryByTestId("bookmark")).not.toBeInTheDocument();
    expect(clickBookmarkIcon).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("filled-bookmark"));
    expect(clickBookmarkIcon).toHaveBeenCalledTimes(1);
  });
  it("renders an unfilled bookmark if the user hasn't liked the post and calls the clickBookMArk function when clicked", () => {
    mockUser.savedPosts = [];
    render(
      <ThemeProvider theme={Theme}>
        <PostIcons
          post={mockPost}
          user={mockUser}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("bookmark")).toBeInTheDocument();
    expect(screen.queryByTestId("filled-bookmark")).not.toBeInTheDocument();
    expect(clickBookmarkIcon).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("bookmark"));
    expect(clickBookmarkIcon).toHaveBeenCalledTimes(1);
  });
});
