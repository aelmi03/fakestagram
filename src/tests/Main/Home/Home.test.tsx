import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import Suggestions from "../../../components/Main/Home/Suggestions";
import SuggestionsList from "../../../components/Main/Home/SuggestionsList";
import StandardPost from "../../../components/Main/Posts/StandardPost";
import { updateFollowing } from "../../../components/utils/utilityFunctions";
import Post from "../../../components/utils/PostInterface";
import { signOut } from "firebase/auth";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { selectUser } from "../../../features/user/userSlice";
import Home from "../../../components/Main/Home";
const originalInnerWidth = global.innerWidth;
const mockFirstPost: Post = { id: "firstPost" } as Post;
const mockSecondPost: Post = { id: "secondPost" } as Post;
const mockThirdPost: Post = { id: "thirdPost" } as Post;
const mockFourthPost: Post = { id: "fourthPost" } as Post;
const mockFifthPost: Post = { id: "fifthPost" } as Post;
type docData = {
  data: () => Post;
};
type mockedPostsType = {
  docs: docData[];
};
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "123",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockedPosts: mockedPostsType;
jest.mock("../../../components/Main/Home/SuggestionsList", () => {
  return () => <div>SuggestionsList Component</div>;
});
jest.mock("../../../components/Main/Home/Suggestions", () => {
  return () => <div>Suggestions Component</div>;
});
jest.mock("../../../components/Main/Posts/StandardPost", () => {
  return () => <div>StandardPost Component</div>;
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
jest.mock("firebase/firestore", () => {
  return {
    query: jest.fn(),
    collection: jest.fn(),
    getFirestore: jest.fn(),
    where: jest.fn(),
    getDocs: () => mockedPosts,
    doc: jest.fn(),
    getDoc: jest.fn(),
    limit: jest.fn(),
    QuerySnapshot: jest.fn(),
    startAfter: jest.fn(),
    DocumentData: jest.fn(),
    orderBy: jest.fn(),
  };
});
describe("Home component", () => {
  beforeEach(() => {
    mockedPosts = {
      docs: [
        {
          data: () => mockFirstPost,
        },
        {
          data: () => mockSecondPost,
        },
        {
          data: () => mockThirdPost,
        },
        {
          data: () => mockFourthPost,
        },
        {
          data: () => mockFifthPost,
        },
      ],
    };
  });
  afterAll(() => {
    global.innerWidth = originalInnerWidth;
  });
  it("renders the SuggestionsList component and not the PostFeed Wrapper which contains all the posts and the Suggestions component if there are no posts", async () => {
    mockedPosts = { docs: [] };
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(screen.getByText("SuggestionsList Component")).toBeInTheDocument();
  });
  it("renders the correct amount of posts", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(screen.getAllByText("StandardPost Component").length).toBe(5);
  });
  it("renders Suggestions Component if the width is greater than or equal to 1024px", async () => {
    global.innerWidth = 1024;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(screen.getByText("Suggestions Component")).toBeInTheDocument();
  });
  it("doesn't render the Suggestions Component if the width is smaller than 1024px", async () => {
    global.innerWidth = 768;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(screen.queryByText("Suggestions Component")).not.toBeInTheDocument();
  });
  it("shows text under the posts saying that there are no more posts to show, and won't render a Load More button if the initial fetch of posts has less than 5 posts total", async () => {
    mockedPosts = {
      docs: [
        {
          data: () => mockFirstPost,
        },
        {
          data: () => mockSecondPost,
        },
        {
          data: () => mockThirdPost,
        },
        {
          data: () => mockFourthPost,
        },
      ],
    };
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(screen.getByText("No more posts to show.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
  });
  it("will not show text under the posts saying that there are no more posts to show, and will render a Load More button if the initial fetch of posts has equal to or more than 5 posts total", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByText("No more posts to show.")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
  });
  it("will successfully render new posts when the Load More button is clicked to the posts list and will render a Load More button if it fetches equal to or more than 8 posts", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    expect(screen.getAllByText("StandardPost Component").length).toBe(5);
    mockedPosts = {
      docs: [
        {
          data: () => {
            return { id: "firstFetchedPosts" } as Post;
          },
        },
        {
          data: () => {
            return { id: "secondFetchedPost" } as Post;
          },
        },
        {
          data: () => {
            return { id: "thirdFetchedPost" } as Post;
          },
        },
        {
          data: () => {
            return { id: "fourthFetchedPost" } as Post;
          },
        },
        {
          data: () => {
            return { id: "fifthFetchedPost" } as Post;
          },
        },
        {
          data: () => {
            return { id: "sixthFetchedPost" } as Post;
          },
        },
        {
          data: () => {
            return { id: "seventhFetchedPost" } as Post;
          },
        },

        {
          data: () => {
            return { id: "eighthFetchedPost" } as Post;
          },
        },
      ],
    };
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Load More" }));
    });
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("StandardPost Component").length).toBe(13);
  });
  it("will successfully render new posts when the Load More button is clicked to the posts list and will render No more posts to show text if it fetches less than 8 posts", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Home />
        </ThemeProvider>
      );
    });
    mockedPosts = {
      docs: [
        {
          data: () => {
            return { id: "firstFetchedPosts" } as Post;
          },
        },
      ],
    };
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Load More" }));
    });
    expect(screen.getByText("No more posts to show.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("StandardPost Component").length).toBe(6);
  });
});
