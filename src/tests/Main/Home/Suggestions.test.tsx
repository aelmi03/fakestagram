import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import Suggestions from "../../../components/Main/Home/Suggestions";
import { updateFollowing } from "../../../components/utils/utilityFunctions";
import { signOut } from "firebase/auth";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";

let mockNavigateFunction = jest.fn();
let mockUser: User;

let mockFirstSuggestedUser: User = {
  fullName: "Lebron James",
  username: "kingjames",
  following: [],
  savedPosts: [],
  id: "kingjames",
  profilePicture: "path/to/photo/for/kingjames",
  biography: "Love riding bicycles and going to the beach :)",
};
type docData = {
  data: () => User;
};
type mockedSuggestedUsers = {
  docs: docData[];
};
let mockSecondSuggestedUser: User = {
  fullName: "Dwayne Johnson",
  username: "therock",
  following: [],
  savedPosts: [],
  id: "therock",
  profilePicture: "path/to/photo/for/kingjames",
  biography: "Love riding bicycles and going to the beach :)",
};

jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});
jest.mock("firebase/auth", () => {
  return {
    signOut: jest.fn(),
    getAuth: jest.fn(),
  };
});
jest.mock("../../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../../components/utils/utilityFunctions"),
    updateFollowing: jest.fn(),
  };
});
let mockSuggestedUsers: mockedSuggestedUsers;
jest.mock("firebase/firestore", () => {
  return {
    ...jest.requireActual("firebase/firestore"),
    collection: jest.fn(),
    getFirestore: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    limit: jest.fn(),
    getDocs: () => mockSuggestedUsers,
  };
});

jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
describe("Suggestions component", () => {
  beforeEach(() => {
    mockSuggestedUsers = {
      docs: [
        {
          data: () => mockFirstSuggestedUser,
        },
        {
          data: () => mockSecondSuggestedUser,
        },
      ],
    };
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
  it("renders the user's profile, username, full name, profile picture, and a log out button next to it", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    const userProfile = screen.getByTestId("User Profile");
    expect(within(userProfile).getByText("Log Out")).toBeInTheDocument();
    expect(
      within(userProfile).getByText(`${mockUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      within(userProfile).getByText(`${mockUser.username}`)
    ).toBeInTheDocument();
    expect(
      (within(userProfile).getByAltText("Profile Picture") as HTMLImageElement)
        .src
    ).toBe(`http://localhost/${mockUser.profilePicture}`);
  });
  it("will call the navigate function with the correct path when a suggested user is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    const userProfile = screen.getByTestId("User Profile");
    userEvent.click(
      within(userProfile).getByTestId(`User Info ${mockUser.id}`)
    );
    expect(mockNavigateFunction.mock.calls[0][0]).toBe(
      `/profile/${mockUser.id}`
    );
  });
  it("calls the signOut function when the Log out button next to the user's profile is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    const userProfile = screen.getByTestId("User Profile");
    expect(signOut).toHaveBeenCalledTimes(0);
    userEvent.click(within(userProfile).getByText(`Log Out`));
    expect(signOut).toHaveBeenCalledTimes(1);
  });
  it("renders the Suggested Users Containerif there are more than 0 suggested users", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId("Suggested Users Container")).toBeInTheDocument();
  });
  it("doesn't render the Suggested Users Container if there are no suggested user", async () => {
    mockSuggestedUsers = { docs: [] };
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByTestId("Suggested Users Container")
    ).not.toBeInTheDocument();
  });
  it("renders the correct amount of suggested users", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    expect(
      screen.getByTestId("Suggested Users Container").children.length
    ).toBe(2);
  });
  it("renders the correct information for each suggested user", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    const firstSuggestedUser = screen.getByTestId(
      `${mockFirstSuggestedUser.id}`
    );
    expect(
      within(firstSuggestedUser).getByText(`${mockFirstSuggestedUser.username}`)
    ).toBeInTheDocument();
    expect(
      within(firstSuggestedUser).getByText(`${mockFirstSuggestedUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      (
        within(firstSuggestedUser).getByAltText(
          "Profile Picture"
        ) as HTMLImageElement
      ).src
    ).toBe(`http://localhost/${mockFirstSuggestedUser.profilePicture}`);
    const secondSuggestedUser = screen.getByTestId(
      `${mockSecondSuggestedUser.id}`
    );
    expect(
      within(secondSuggestedUser).getByText(
        `${mockSecondSuggestedUser.username}`
      )
    ).toBeInTheDocument();
    expect(
      within(secondSuggestedUser).getByText(
        `${mockSecondSuggestedUser.fullName}`
      )
    ).toBeInTheDocument();
    expect(
      (
        within(secondSuggestedUser).getByAltText(
          "Profile Picture"
        ) as HTMLImageElement
      ).src
    ).toBe(`http://localhost/${mockSecondSuggestedUser.profilePicture}`);
  });
  it("will render a follow or following button depending on if the user is following them", async () => {
    mockUser.following = ["kingjames"];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    const firstSuggestedUser = screen.getByTestId(
      `${mockFirstSuggestedUser.id}`
    );
    expect(
      within(firstSuggestedUser).getByText("Following")
    ).toBeInTheDocument();
    expect(
      within(firstSuggestedUser).queryByText("Follow")
    ).not.toBeInTheDocument();

    const secondSuggestedUser = screen.getByTestId(
      `${mockSecondSuggestedUser.id}`
    );

    expect(within(secondSuggestedUser).getByText("Follow")).toBeInTheDocument();
    expect(
      within(secondSuggestedUser).queryByText("Following")
    ).not.toBeInTheDocument();
  });
  it("will call the updateFollowing function with the correct arguement when the follow or following button is clicked", async () => {
    mockUser.following = ["kingjames"];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    const firstSuggestedUser = screen.getByTestId(
      `${mockFirstSuggestedUser.id}`
    );
    const secondSuggestedUser = screen.getByTestId(
      `${mockSecondSuggestedUser.id}`
    );
    userEvent.click(within(firstSuggestedUser).getByText("Following"));
    expect((updateFollowing as jest.Mock).mock.calls[0][0]).toEqual(mockUser);
    expect((updateFollowing as jest.Mock).mock.calls[0][1]).toEqual(
      mockFirstSuggestedUser
    );
    userEvent.click(within(secondSuggestedUser).getByText("Follow"));
    expect((updateFollowing as jest.Mock).mock.calls[1][0]).toEqual(mockUser);
    expect((updateFollowing as jest.Mock).mock.calls[1][1]).toEqual(
      mockSecondSuggestedUser
    );
  });
  it("will call the navigate function with the correct path when a suggested user is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Suggestions />
        </ThemeProvider>
      );
    });
    userEvent.click(
      screen.getByTestId(`User Info ${mockFirstSuggestedUser.id}`)
    );
    expect(mockNavigateFunction.mock.calls[0][0]).toBe(
      `/profile/${mockFirstSuggestedUser.id}`
    );
    userEvent.click(
      screen.getByTestId(`User Info ${mockSecondSuggestedUser.id}`)
    );
    expect(mockNavigateFunction.mock.calls[1][0]).toBe(
      `/profile/${mockSecondSuggestedUser.id}`
    );
  });
});
