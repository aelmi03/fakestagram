import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { ThemeProvider } from "styled-components";
import { deletePost } from "../../../components/utils/utilityFunctions";
import LargeModal from "../../../components/Main/Posts/LargeModal";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import { Comment as IComment } from "../../../components/utils/PostInterface";
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

let mockNavigateFunction = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
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
    useAppSelector: (func: () => void) => func(),
  };
});
jest.mock("../../../features/user/userSlice", () => {
  return {
    ...jest.requireActual("../../../features/user/userSlice"),
    selectUser: () => mockUser,
  };
});
jest.mock("../../../features/users/usersSlice", () => {
  return {
    selectAllUsers: () => [mockUser],
  };
});
jest.mock("../../../components/Main/Posts/Comments", () => {
  return () => <div>Comments Component</div>;
});
jest.mock("../../../components/Main/Posts/Comment", () => {
  return ({ comment }: { comment: IComment }) => <div>{comment.content}</div>;
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
  let changeLikesModalStatus: jest.Mock;

  beforeEach(() => {
    changeLikesModalStatus = jest.fn();
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
          changeLikesModalStatus={changeLikesModalStatus}
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
          changeLikesModalStatus={changeLikesModalStatus}
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
          changeModalStatus={changeModalStatus}
          changeLikesModalStatus={changeLikesModalStatus}
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
          changeLikesModalStatus={changeLikesModalStatus}
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
  it("will navigate to the post user's account when the username or profile picture is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <LargeModal
          post={mockPost}
          changeLikesModalStatus={changeLikesModalStatus}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(mockNavigateFunction).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Post User"));
    expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    expect(mockNavigateFunction.mock.calls[0][0]).toBe(
      `/profile/${mockUser.id}`
    );
  });
});
