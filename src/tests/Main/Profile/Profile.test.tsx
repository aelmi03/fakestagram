import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Profile from "../../../components/Main/Profile";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";

import { updateFollowing } from "../../../components/utils/utilityFunctions";
import { signOut } from "firebase/auth";

let mockUser: User;
let mockProfileUser: User;
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
type mockProps = {
  changePostToShow: (post: Post | null) => void;
  post?: Post;
};
jest.mock("../../../components/Main/Profile/ProfilePosts", () => {
  return ({ changePostToShow }: mockProps) => (
    <div onClick={() => changePostToShow(mockPost)}>
      Profile Posts Component
    </div>
  );
});

jest.mock("../../../components/Main/Posts/StandardPost", () => {
  return ({ changePostToShow, post }: mockProps) => (
    <div
      onClick={() => {
        changePostToShow(null);
      }}
    >
      Standard Post Component
      <div>{post?.caption}</div>
      <div>{post?.likes.length} likes</div>
      <div>{post?.id}</div>
      <div>{post?.comments.length} comments</div>
    </div>
  );
});
jest.mock("../../../components/Main/Profile/EditProfileModal", () => {
  type mockEditProfileProps = {
    toggleEditProfileModal: () => void;
  };
  return ({ toggleEditProfileModal }: mockEditProfileProps) => (
    <div onClick={toggleEditProfileModal}>Edit Profile Component</div>
  );
});
jest.mock("../../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../../components/utils/utilityFunctions"),
    getFollowers: jest.fn(async () => ["follower", "follower", "follower"]),
    getProfileUserPosts: jest.fn(async () => [
      "firstPost",
      "secondPost",
      "thirdPost",
      "fourthPost",
      "fifthPost",
    ]),
    updateFollowing: jest.fn(),
  };
});
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(),
    signOut: jest.fn(),
  };
});

jest.mock("firebase/firestore", () => {
  type mockSnapshotArguement = {
    data: () => typeof mockUser;
  };
  return {
    getFirestore: jest.fn(),
    onSnapshot: jest.fn(
      (firstArg: any, secondArg: (firstArg: mockSnapshotArguement) => void) => {
        secondArg({
          data: () => mockProfileUser,
        });
        return () => {};
      }
    ),
    doc: jest.fn(),
  };
});
jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});
jest.mock("react-router-dom", () => {
  return {
    useParams: jest.fn(() => {
      return {
        userID: "randomUserID",
      };
    }),
  };
});
describe("Profile Component", () => {
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
    mockProfileUser = { ...mockUser, id: "profileUserID" };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders an Edit Profile, and Log Out button if the user is viewing their own profile", async () => {
    mockProfileUser.id = "fakeUserID";
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
  it("renders a Follow button if the user is not following the account they are viewing, and a message button", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
    expect(screen.getByText("Follow")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });
  it("renders a Follow button if the user is not following the account they are viewing, and a message button", async () => {
    mockUser.following = ["profileUserID"];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
    expect(screen.getByText("Following")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });
  it("renders the correct number of posts, followers, and the amount of people the profile's user is following", async () => {
    mockProfileUser.following = [
      "firstAccount",
      "secondAccount",
      "thirdAccount",
      "fourthAccount",
    ];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId("Posts")).toHaveTextContent("5 posts");
    expect(screen.getByTestId("Followers")).toHaveTextContent("3 followers");
    expect(screen.getByTestId("Following")).toHaveTextContent(
      `${mockProfileUser.following.length} following`
    );
  });
  it("renders the users profile picture with the proper imgSrc, and shows the profile user's username, full name, and biography", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId("Full Name")).toHaveTextContent(
      `${mockProfileUser.fullName}`
    );
    expect(screen.getByTestId("Username")).toHaveTextContent(
      `${mockProfileUser.username}`
    );
    expect(screen.getByTestId("Biography")).toHaveTextContent(
      `${mockProfileUser.biography}`
    );
    expect(
      (screen.getByTestId("Profile Picture") as HTMLImageElement).src
    ).toBe(`http://localhost/${mockProfileUser.profilePicture}`);
  });
  it("is able to show the EditProfileModal component when the EditProfileModal component is clicked and will not render it when the EditProfileModal component calls the toggleEditProfileModal function", async () => {
    mockProfileUser.id = "fakeUserID";
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByText("Edit Profile Component")
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Edit Profile" }));
    expect(screen.getByText("Edit Profile Component")).toBeInTheDocument();
    userEvent.click(screen.getByText("Edit Profile Component"));
    expect(
      screen.queryByText("Edit Profile Component")
    ).not.toBeInTheDocument();
  });
  it("It will call the sign out function from firebase storage when the Log Out button is clicked", async () => {
    mockProfileUser.id = "fakeUserID";
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(signOut).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(signOut).toHaveBeenCalledTimes(1);
  });
  it("calls the updateFollowing function from the utilityFunctions file when the Follow button is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(updateFollowing).toHaveBeenCalledTimes(0);
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Follow" }));
    });
    expect(updateFollowing).toHaveBeenCalledTimes(1);
  });
  it("calls the updateFollowing function from the utilityFunctions file when the Following button is clicked", async () => {
    mockUser.following = ["profileUserID"];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(updateFollowing).toHaveBeenCalledTimes(0);
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Following" }));
    });
    expect(updateFollowing).toHaveBeenCalledTimes(1);
  });
  it("renders the StandardPost component with the correct post when the ProfilePosts component calls the changePostToShow function, and will not unrender the StandardPost component if it calls the changePostToShow function", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByText("Standard Post Component")
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByText("Profile Posts Component"));
    expect(screen.getByText("Standard Post Component")).toBeInTheDocument();
    expect(screen.getByText(`${mockPost.caption}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockPost.id}`)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockPost.likes.length} likes`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${mockPost.comments.length} comments`)
    ).toBeInTheDocument();
    userEvent.click(screen.getByText("Standard Post Component"));
    expect(
      screen.queryByText("Standard Post Component")
    ).not.toBeInTheDocument();
  });
  it("will not render the StandardPost component if the ReturnBack component is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Profile />
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByText("Standard Post Component")
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByText("Profile Posts Component"));
    expect(screen.getByText("Standard Post Component")).toBeInTheDocument();
    userEvent.click(screen.getByTestId("Go back"));
    expect(
      screen.queryByText("Standard Post Component")
    ).not.toBeInTheDocument();
  });
});
