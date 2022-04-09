import { act, fireEvent, render, screen, within } from "@testing-library/react";
import Theme from "../../../../Themes/Theme";
import { ThemeProvider } from "styled-components";
import Search from "../../../../components/Main/Navbar/Search";
import { User } from "../../../../features/user/userSlice";
import userEvent from "@testing-library/user-event";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../app/hooks";
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "123",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockSecondUser: User = {
  fullName: "Joker",
  username: "joker123",
  following: [],
  savedPosts: [],
  id: "joker123",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockRecentSeachResult: any;
let originalInnerWidth = global.innerWidth;
const mockDate = new Date("2022-09-26T00:00:00.000Z");
let spy = jest.spyOn(global, "Date").mockImplementation((): any => {
  return mockDate;
});
jest.mock("../../../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});
let originalPromiseAll = Promise.all;
Promise.all = async () => {
  return [mockUser, mockSecondUser];
};
jest.mock("firebase/firestore", () => {
  return {
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(() => {
      return {
        data: () => mockRecentSeachResult,
      };
    }),
    getDocs: jest.fn().mockResolvedValue({
      docs: [
        {
          data: () => mockUser,
        },
        {
          data: () => mockSecondUser,
        },
      ],
    }),
    getFirestore: jest.fn(),
    query: jest.fn(),
    setDoc: jest.fn(),
  };
});
let mockNavigateFunction = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
describe("Search Component", () => {
  beforeEach(() => {
    mockRecentSeachResult = {
      recentSearches: [{ id: "firstRecentSearch", timestamp: new Date() }],
    };
    jest.clearAllMocks();
  });
  afterAll(() => {
    Promise.all = originalPromiseAll;
    global.innerWidth = originalInnerWidth;
    spy.mockRestore();
  });
  it("if there are no recent searches and the search input is empty it will show text telling the user there are no recent searches", () => {
    mockRecentSeachResult = {};
    render(
      <ThemeProvider theme={Theme}>
        <Search />
      </ThemeProvider>
    );
    expect(screen.getByText("No recent searches.")).toBeInTheDocument();
  });
  it("will render the correct amount of recent searches with the right information if there are any and the search input is empty", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    expect(screen.getAllByTestId("Recent Search Result").length).toEqual(2);
    expect(screen.queryByText("No recent searches.")).not.toBeInTheDocument();
    expect(screen.getByText(`${mockUser.username}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser.fullName}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockSecondUser.username}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockSecondUser.fullName}`)).toBeInTheDocument();
  });
  it("will delete a recent search result when the delete icon for it is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    expect(screen.getAllByTestId("Recent Search Result").length).toEqual(2);
    const firstMockUser = screen.getAllByTestId("Recent Search Result")[0];
    expect(screen.getByText(`${mockUser.fullName}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser.username}`)).toBeInTheDocument();
    userEvent.click(within(firstMockUser).getByTestId("Delete Icon"));
    expect(screen.getAllByTestId("Recent Search Result").length).toEqual(1);
    expect(screen.queryByText(`${mockUser.fullName}`)).not.toBeInTheDocument();
    expect(screen.queryByText(`${mockUser.username}`)).not.toBeInTheDocument();
    expect(screen.getByText(`${mockSecondUser.username}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockSecondUser.fullName}`)).toBeInTheDocument();
  });
  it("will initially hide the SearchesContainer if the window.innerWidth is greater than or equal to 768px and will show the Searches Container when the search input is clicked and will go away when anywhere else is clicked", async () => {
    global.innerWidth = 768;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    expect(screen.queryByTestId("Searches Container")).not.toBeVisible();
    userEvent.click(screen.getByPlaceholderText("🔍 Search"));
    expect(screen.getByTestId("Searches Container")).toBeVisible();
    userEvent.click(screen.getByTestId("Click Wrapper"));
    expect(screen.queryByTestId("Searches Container")).not.toBeVisible();
  });
  it("will always show the Searches Container even if the ClickWrapper is clicked", async () => {
    global.innerWidth = 300;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    expect(screen.queryByTestId("Searches Container")).toBeVisible();
    userEvent.click(screen.getByPlaceholderText("🔍 Search"));
    expect(screen.getByTestId("Searches Container")).toBeVisible();
    userEvent.click(screen.getByTestId("Click Wrapper"));
    expect(screen.queryByTestId("Searches Container")).toBeVisible();
  });
  it("will clear all the recent searches if the Clear all button is clicked", async () => {
    global.innerWidth = 300;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    expect(screen.getAllByTestId("Recent Search Result").length).toEqual(2);
    userEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(screen.queryAllByTestId("Recent Search Result").length).toEqual(0);
  });
  it("it will show text saying that there were no results found if the user enters a username that no user has", async () => {
    global.innerWidth = 300;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    const searchInput = screen.getByPlaceholderText("🔍 Search");
    await act(async () => {
      userEvent.type(searchInput, "z");
    });
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
  it("will show the proper Search Results when the user types into the search input based on the username", async () => {
    global.innerWidth = 300;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    const searchInput = screen.getByPlaceholderText("🔍 Search");
    await act(async () => {
      userEvent.type(searchInput, "j");
    });
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("SearchResult Container").length).toEqual(2);
    await act(async () => {
      await userEvent.clear(searchInput);
      userEvent.type(searchInput, "joker123");
    });
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("SearchResult Container").length).toEqual(1);
    await act(async () => {
      await userEvent.clear(searchInput);
      userEvent.type(searchInput, "johnDoe23");
    });
    expect(screen.queryByText("No results found.")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("SearchResult Container").length).toEqual(1);
    await act(async () => {
      await userEvent.clear(searchInput);
      userEvent.type(searchInput, "johnDoeJoker123");
    });
    expect(screen.queryAllByTestId("SearchResult Container").length).toEqual(0);
    expect(screen.queryByText("No results found.")).toBeInTheDocument();
  });
  it("should close the Searches Container when a Search Result component is clicked and call the navigate function to go to that user's profile, and will call the setDoc with the new recentSearches array with the most recently searched user", async () => {
    window.innerWidth = 768;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Search />
        </ThemeProvider>
      );
    });
    expect(screen.queryByTestId("Searches Container")).not.toBeVisible();
    userEvent.click(screen.getByPlaceholderText("🔍 Search"));
    expect(screen.queryByTestId("Searches Container")).toBeVisible();
    expect(mockNavigateFunction).not.toHaveBeenCalled();
    await act(async () => {
      userEvent.click(screen.getAllByTestId("SearchResult Container")[1]);
    });
    expect(screen.queryByTestId("Searches Container")).not.toBeVisible();
    expect(mockNavigateFunction).toHaveBeenCalled();
    expect(mockNavigateFunction.mock.calls[0][0]).toEqual(
      `../profile/${mockSecondUser.id}`
    );
    expect(setDoc.mock.calls[0][1]).toEqual({
      recentSearches: [
        { id: "joker123", timestamp: new Date() },
        { id: "firstRecentSearch", timestamp: new Date() },
      ],
    });
  });
});
