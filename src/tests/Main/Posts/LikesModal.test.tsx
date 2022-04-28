import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { ThemeProvider } from "styled-components";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";
import LikesModal from "../../../components/Main/Posts/LikesModal";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
const changeLikesModalStatus = jest.fn();
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "johnDoe",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockSecondUser: User = {
  fullName: "Lebron James",
  username: "kingjames",
  following: [],
  savedPosts: [],
  id: "kingjames",
  profilePicture: "path/to/photo/for/kingjames",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockPost: Post;
jest.mock("../../../features/users/usersSlice", () => {
  return {
    ...jest.requireActual("../../../features/users/usersSlice"),
    selectAllUsers: () => [mockUser, mockSecondUser],
  };
});
jest.mock("../../../components/utils/UserDetail", () => {
  return ({ otherUser }: { otherUser: User }) => (
    <div data-testid="Liked User">
      <h1>{otherUser.fullName}</h1>
      <h1>{otherUser.username}</h1>
    </div>
  );
});
jest.mock("../../../features/user/userSlice", () => {
  return {
    ...jest.requireActual("../../../features/user/userSlice"),
    selectUser: () => mockUser,
  };
});
describe("LikesModal Component", () => {
  beforeEach(() => {
    mockPost = {
      postedBy: "johnDoe",
      comments: [],
      likes: ["johnDoe", "kingjames"],
      caption: "Went on a trip!",
      timestamp: {
        toDate: () => "faketimestamp" as unknown as Date,
      } as unknown as Timestamp,
      id: "fakePostID",
      imgSrc: "fakeImgSrc",
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("calls the changeLikesModalStatus if the Modal Wrapper is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <LikesModal
            post={mockPost}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        </Provider>
      </ThemeProvider>
    );
    userEvent.click(screen.getByTestId("LikesModal Wrapper"));
    expect(changeLikesModalStatus).toHaveBeenCalledTimes(1);
  });
  it("calls the changeLikesModalStatus if the Go Back icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <LikesModal
            post={mockPost}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        </Provider>
      </ThemeProvider>
    );
    expect(changeLikesModalStatus).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(changeLikesModalStatus).toHaveBeenCalledTimes(1);
  });
  it("will show a message saying there are no likes if the post has zero likes", () => {
    mockPost.likes = [];
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <LikesModal
            post={mockPost}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        </Provider>
      </ThemeProvider>
    );
    expect(
      screen.getByText("There are no likes on this post.")
    ).toBeInTheDocument();
  });
  it("will show a message saying there are no likes if the post has zero likes", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <LikesModal
            post={mockPost}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        </Provider>
      </ThemeProvider>
    );
    expect(
      screen.queryByText("There are no likes on this post.")
    ).not.toBeInTheDocument();
  });
  it("will show the correct number of users that liked the post", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <LikesModal
            post={mockPost}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getAllByTestId("Liked User").length).toBe(2);
  });
  it("passes in the correct user object to each UserDetail component", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <LikesModal
            post={mockPost}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        </Provider>
      </ThemeProvider>
    );
    const firstUser = screen.getAllByTestId("Liked User")[0];
    expect(
      within(firstUser).getByText(`${mockUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      within(firstUser).getByText(`${mockUser.username}`)
    ).toBeInTheDocument();
    const secondUser = screen.getAllByTestId("Liked User")[1];
    expect(
      within(secondUser).getByText(`${mockSecondUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      within(secondUser).getByText(`${mockSecondUser.username}`)
    ).toBeInTheDocument();
  });
});
