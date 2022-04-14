import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import SuggestionsList from "../../../components/Main/Home/SuggestionsList";
import {
  followsOtherUser,
  updateFollowing,
} from "../../../components/utils/utilityFunctions";
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
jest.mock("../../../components/utils/utilityFunctions", () => {
  return {
    ...jest.requireActual("../../../components/utils/utilityFunctions"),
    updateFollowing: jest.fn(),
  };
});
const mockSuggestedUsers = {
  docs: [
    {
      data: () => mockFirstSuggestedUser,
    },
    {
      data: () => mockSecondSuggestedUser,
    },
  ],
};
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
describe("SuggestionsList component", () => {
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
  it("renders the Suggestions for you text", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <SuggestionsList />
        </ThemeProvider>
      );
    });
    expect(screen.getByText("Suggestions For You")).toBeInTheDocument();
  });
  it("renders the correct amount of suggested users", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <SuggestionsList />
        </ThemeProvider>
      );
    });
    expect(
      screen.getByTestId("SuggestionsList Container").children.length
    ).toBe(2);
  });
  it("renders the suggested users with the correct information", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <SuggestionsList />
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
  });
  it("will render a follow or following button depending on if the user is following them", async () => {
    mockUser.following = ["kingjames"];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <SuggestionsList />
        </ThemeProvider>
      );
    });
    const firstSuggestedUser = screen.getByTestId(
      `${mockFirstSuggestedUser.id}`
    );
    expect(
      within(firstSuggestedUser).getByRole("button", { name: "Following" })
    ).toBeInTheDocument();
    expect(
      within(firstSuggestedUser).queryByRole("button", { name: "Follow" })
    ).not.toBeInTheDocument();
    const secondSuggestedUser = screen.getByTestId(
      `${mockSecondSuggestedUser.id}`
    );
    expect(
      within(secondSuggestedUser).getByRole("button", { name: "Follow" })
    ).toBeInTheDocument();
    expect(
      within(secondSuggestedUser).queryByRole("button", { name: "Following" })
    ).not.toBeInTheDocument();
  });
  it("will call the updateFollowing function with the correct arguement when the follow or following button is clicked", async () => {
    mockUser.following = ["kingjames"];
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <SuggestionsList />
        </ThemeProvider>
      );
    });
    const firstSuggestedUser = screen.getByTestId(
      `${mockFirstSuggestedUser.id}`
    );
    const secondSuggestedUser = screen.getByTestId(
      `${mockSecondSuggestedUser.id}`
    );
    userEvent.click(
      within(firstSuggestedUser).getByRole("button", { name: "Following" })
    );
    expect((updateFollowing as jest.Mock).mock.calls[0][0]).toEqual(mockUser);
    expect((updateFollowing as jest.Mock).mock.calls[0][1]).toEqual(
      mockFirstSuggestedUser
    );
    userEvent.click(
      within(secondSuggestedUser).getByRole("button", { name: "Follow" })
    );
    expect((updateFollowing as jest.Mock).mock.calls[1][0]).toEqual(mockUser);
    expect((updateFollowing as jest.Mock).mock.calls[1][1]).toEqual(
      mockSecondSuggestedUser
    );
  });
  it("will call the navigate function with the correct path when a suggested user is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <SuggestionsList />
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
