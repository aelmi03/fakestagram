import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { ThemeProvider } from "styled-components";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";
import Modal from "../../../components/Main/Posts/Modal";
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
    <div data-testid="User">
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
  it("calls the changeModalStatus prop function if the Modal Wrapper is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    userEvent.click(screen.getByTestId("LikesModal Wrapper"));
    expect(changeLikesModalStatus).toHaveBeenCalledTimes(1);
  });
  it("renders the heading that is equal to the string name prop passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getByText("Modal")).toBeInTheDocument();
  });
  it("calls the changeModalStatus prop function if the Go Back icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    expect(changeLikesModalStatus).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(changeLikesModalStatus).toHaveBeenCalledTimes(1);
  });
  it("will show the noUsersMessage string prop if the usersID is empty", () => {
    mockPost.likes = [];
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    expect(
      screen.getByText("There are no likes on this post.")
    ).toBeInTheDocument();
  });
  it("won't show the noUsersMessage string prop if the usersID is not empty", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    expect(
      screen.queryByText("There are no likes on this post.")
    ).not.toBeInTheDocument();
  });
  it("will show the correct number of users ", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getAllByTestId("User").length).toBe(2);
  });
  it("passes in the correct user object to each UserDetail component", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Modal
            changeModalStatus={changeLikesModalStatus}
            usersID={mockPost.likes}
            name="Modal"
            noUsersMessage="There are no likes on this post."
          />
        </Provider>
      </ThemeProvider>
    );
    const firstUser = screen.getAllByTestId("User")[0];
    expect(
      within(firstUser).getByText(`${mockUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      within(firstUser).getByText(`${mockUser.username}`)
    ).toBeInTheDocument();
    const secondUser = screen.getAllByTestId("User")[1];
    expect(
      within(secondUser).getByText(`${mockSecondUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      within(secondUser).getByText(`${mockSecondUser.username}`)
    ).toBeInTheDocument();
  });
});
