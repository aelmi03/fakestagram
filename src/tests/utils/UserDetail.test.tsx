import { within, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { updateFollowing } from "../../components/utils/utilityFunctions";
import { User } from "../../features/user/userSlice";
import UserDetail from "../../components/utils/UserDetail";

import Theme from "../../Themes/Theme";
const mockPropUser: User = {
  fullName: "Dwayne Johnson",
  username: "therock",
  following: [],
  savedPosts: [],
  id: "therock",
  profilePicture: "path/to/photo/for/kingjames",
  biography: "Love riding bicycles and going to the beach :)",
};

let mockUser: User;
let mockNavigateFunction = jest.fn();
jest.mock("../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../components/utils/utilityFunctions"),
    updateFollowing: jest.fn(),
  };
});
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
jest.mock("../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});
jest.mock("../../components/utils/UserInfo", () => {
  interface MockProps {
    user: User;
    onClick: (user: User) => void;
  }
  return ({ user, onClick }: MockProps) => (
    <div data-testid={`${user.id}`} onClick={() => onClick(user)}>
      UserInfo Component
      <h1>{user.id}</h1>
    </div>
  );
});
describe("UserDetail Component", () => {
  beforeEach(() => {
    mockUser = {
      fullName: "John Doe",
      username: "johnDoe23",
      following: [],
      savedPosts: [],
      id: "fakeUserID",
      profilePicture: "path/to/photo/for/johnDoe23",
      biography: "Love riding bicycles and going to the beach :)",
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders a UserInfo component with the the user prop passed into it", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserDetail otherUser={mockPropUser} />
      </ThemeProvider>
    );
    expect(screen.getByText("UserInfo Component")).toBeInTheDocument();
    expect(
      within(screen.getByText("UserInfo Component")).getByText(
        `${mockPropUser.id}`
      )
    ).toBeInTheDocument();
  });
  it("calls the navigate function with the profile path of the user prop passed in when the UserInfo is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserDetail otherUser={mockPropUser} />
      </ThemeProvider>
    );
    expect(mockNavigateFunction).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByText("UserInfo Component"));
    expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    expect(mockNavigateFunction.mock.calls[0][0]).toBe("/profile/therock");
  });
  it("renders a Following button if the user is following the user prop passed into it", () => {
    mockUser.following = ["therock"];
    render(
      <ThemeProvider theme={Theme}>
        <UserDetail otherUser={mockPropUser} />
      </ThemeProvider>
    );
    expect(
      screen.getByRole("button", { name: "Following" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Follow" })
    ).not.toBeInTheDocument();
  });
  it("renders a Follow button if the user is not following the user prop passed into it", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserDetail otherUser={mockPropUser} />
      </ThemeProvider>
    );
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Following" })
    ).not.toBeInTheDocument();
  });
  it("will call the updateFollowing with the correct arguments when the Follow button is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserDetail otherUser={mockPropUser} />
      </ThemeProvider>
    );
    userEvent.click(screen.getByRole("button", { name: "Follow" }));
    expect((updateFollowing as jest.Mock).mock.calls[0][0]).toBe(mockUser);
    expect((updateFollowing as jest.Mock).mock.calls[0][1]).toBe(mockPropUser);
  });
  it("will call the updateFollowing with the correct arguments when the Following button is clicked", () => {
    mockUser.following = ["therock"];
    render(
      <ThemeProvider theme={Theme}>
        <UserDetail otherUser={mockPropUser} />
      </ThemeProvider>
    );
    userEvent.click(screen.getByRole("button", { name: "Following" }));
    expect((updateFollowing as jest.Mock).mock.calls[0][0]).toBe(mockUser);
    expect((updateFollowing as jest.Mock).mock.calls[0][1]).toBe(mockPropUser);
  });
});
