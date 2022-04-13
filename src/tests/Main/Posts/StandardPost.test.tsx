import { Timestamp } from "firebase/firestore";
import { deletePost } from "../../../components/utils/utilityFunctions";
import StandardPost from "../../../components/Main/Posts/StandardPost";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { User } from "../../../features/user/userSlice";
import Post from "../../../components/utils/PostInterface";
let originalInnerWidth = global.innerWidth;
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
  comments: [
    {
      content: "this is the first comment",
      id: "firstCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2021-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the second comment",
      id: "secondCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
  ],
  likes: [],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "fakePostID",
  imgSrc: "fakeImgSrc",
};
let mockNavigateFunction = jest.fn();

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
  interface MockProps {
    changeModalStatus: () => void;
  }
  return ({ changeModalStatus }: MockProps) => (
    <div onClick={() => changeModalStatus()}>Post Modal Component</div>
  );
});
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
jest.mock("../../../components/Main/Posts/Comment", () => {
  return ({ user, content }: { user: User; content: string }) => (
    <div>
      <h1>{user.username}</h1> <h1>{content}</h1>
    </div>
  );
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
    mockPost.comments = [
      {
        content: "this is the first comment",
        id: "firstCommentID",
        user: "randomID",
        timestamp: {
          toDate: () => new Date("2021-09-26T00:00:00.000Z"),
        } as unknown as Timestamp,
      },
      {
        content: "this is the second comment",
        id: "secondCommentID",
        user: "randomID",
        timestamp: {
          toDate: () => new Date("2022-09-26T00:00:00.000Z"),
        } as unknown as Timestamp,
      },
    ];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    global.innerWidth = originalInnerWidth;
  });
  it("renders a comment using the the content of the caption, and uses the formatDistanceToNow function to display how long ago the post was made", () => {
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
    expect(screen.getByText("Went on a trip!")).toBeInTheDocument();
    expect(screen.getByText("2h ago")).toBeInTheDocument();
  });
  it("is able to show the delete button when the three dots svg icon is clicked, and calls the deletePost function when it's clicked, and is able to make it go away when the user clicks away from it", () => {
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
    userEvent.click(screen.getByTestId("StandardPost Wrapper"));
    expect(screen.queryByTestId("Delete Post Button")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("three dots"));
    expect(deletePost).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Delete Post Button"));
    expect(deletePost).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("Delete Post Button")).not.toBeInTheDocument();
  });
  it("Doesn't render the clickable view all comments text when the post doesn't have any comments", () => {
    mockPost.comments = [];
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
    expect(screen.queryByText(/view all/i)).not.toBeInTheDocument();
  });
  it("renders the clickable view all comments text with the correct number of comments when the post has comments", () => {
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
    expect(screen.getByText(/view all 2 comments/i)).toBeInTheDocument();
  });
  it("renders the PostModal component when either the chat svg icon is clicked, or the clickable View all comments text is clicked", () => {
    global.innerWidth = 540;
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
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("chat"));
    expect(screen.getByText("Post Modal Component")).toBeInTheDocument();
    userEvent.click(screen.getByText("Post Modal Component"));
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
    userEvent.click(screen.getByText(/view all 2 comments/i));
    expect(screen.getByText("Post Modal Component")).toBeInTheDocument();
  });
  it("renders the PostModal initially if the window.innerWidth is greater than or equal to 768", () => {
    global.innerWidth = 768;
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
    expect(screen.queryByText("Post Modal Component")).toBeInTheDocument();
  });
  it("doesn't render the PostModal initially if the window.innerWidth is less than 768", () => {
    global.innerWidth = 542;
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
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
  });
  it("is able to accurately render and not render based on the showPostModal status when the width is smaller than 768px", () => {
    global.innerWidth = 300;
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
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
    userEvent.click(screen.getByText(/view all 2 comments/i));
    expect(screen.getByText("Post Modal Component")).toBeInTheDocument();
    userEvent.click(screen.getByText("Post Modal Component"));
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
  });
  it("always renders the PostModal component even when the changeModalStatus function is called when the width is greater than or equal to 768px and isOnHomePosts is false", () => {
    global.innerWidth = 768;
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
    expect(screen.getByText("Post Modal Component")).toBeInTheDocument();
    userEvent.click(screen.getByText("Post Modal Component"));
    expect(screen.queryByText("Post Modal Component")).toBeInTheDocument(); //showModalStatus will always be true when the width is equal to or greater than 768px and isOnHomePosts is false
  });
  it("is able to accurately render and not render the PostModal component based on the showPostModal status when the width is greater than or equal to 768px and the isOnHomePosts prop is true", () => {
    global.innerWidth = 768;
    isOnHomePosts = true;
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
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
    userEvent.click(screen.getByText(/view all 2 comments/i));
    expect(screen.getByText("Post Modal Component")).toBeInTheDocument();
    userEvent.click(screen.getByText("Post Modal Component"));
    expect(screen.queryByText("Post Modal Component")).not.toBeInTheDocument();
  });
  it("calls the navigate function when the username or profile picture of the postUser is clicked", () => {
    global.innerWidth = 768;
    isOnHomePosts = true;
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
    expect(mockNavigateFunction).toHaveBeenCalledTimes(0);
    userEvent.click(
      screen.getByTestId("Username and Profile Picture Container")
    );
    expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    expect(mockNavigateFunction.mock.calls[0][0]).toBe(
      `/profile/${mockUser.id}`
    );
  });
});
