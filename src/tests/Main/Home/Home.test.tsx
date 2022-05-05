import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";

import Home from "../../../components/Main/Home";
import { store } from "../../../app/store";
import { Provider } from "react-redux";
const originalInnerWidth = global.innerWidth;
const mockFirstPost: Post = { id: "firstPost" } as Post;
const mockSecondPost: Post = { id: "secondPost" } as Post;
const mockThirdPost: Post = { id: "thirdPost" } as Post;
const mockFourthPost: Post = { id: "fourthPost" } as Post;
const mockFifthPost: Post = { id: "fifthPost" } as Post;
const mockSixthPost: Post = { id: "sixthPost" } as Post;
const mockSeventhPost: Post = { id: "seventhPost" } as Post;
const mockEighthPost: Post = { id: "eighthPost" } as Post;

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
let mockPostsRequested: number;
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
    ...jest.requireActual("../../../app/hooks"),
    useAppSelector: (func: () => void) => func(),
  };
});
jest.mock("../../../features/user/userSlice", () => {
  return {
    ...jest.requireActual("../../../features/user/userSlice"),
    selectUser: () => mockUser,
    __esModule: true,
  };
});
jest.mock("../../../features/users/usersSlice", () => {
  return {
    ...jest.requireActual("../../../features/users/usersSlice"),
    selectAllUsers: () => [mockUser],
    __esModule: true,
  };
});
jest.mock("../../../features/homePosts/homePostsSlice", () => {
  return {
    ...jest.requireActual("../../../features/homePosts/homePostsSlice"),
    selectHomePostsAmount: () => {
      return mockPostsRequested;
    },
    __esModule: true,
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
        {
          data: () => mockSixthPost,
        },
        {
          data: () => mockSeventhPost,
        },
        {
          data: () => mockEighthPost,
        },
      ],
    };
    mockPostsRequested = 8;
  });
  afterAll(() => {
    global.innerWidth = originalInnerWidth;
  });
  it("renders the SuggestionsList component and not the PostFeed Wrapper which contains all the posts and the Suggestions component if there are no posts", async () => {
    mockedPosts = { docs: [] };
    console.log(store.getState());
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getByText("SuggestionsList Component")).toBeInTheDocument();
  });
  it("renders the correct amount of posts", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getAllByText("StandardPost Component").length).toBe(8);
  });
  it("renders Suggestions Component if the width is greater than or equal to 1024px", async () => {
    global.innerWidth = 1024;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
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
          <Provider store={store}>
            <Home />
          </Provider>
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
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getByText("~End Of Your Feed~")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
  });
  it("will not show text under the posts saying that there are no more posts to show, and will render a Load More button if the initial fetch of posts has equal to or more than 8 posts total", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.queryByText("~End Of Your Feed~")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
  });
  it("will successfully render new posts when the Load More button is clicked to the posts list and will render a Load More button if it fetches equal to or more than 8 posts, it will also properly update the number of postsRequested in homePostsSlice in the redux store", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getAllByText("StandardPost Component").length).toBe(8);
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
      ],
    };
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Load More" }));
    });
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("StandardPost Component").length).toBe(12);
    expect(store.getState().homePostsRequested).toBe(12);
  });
  it("will successfully render new posts when the Load More button is clicked to the posts list and will render No more posts to show text if it fetches less than 8 posts", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
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
    expect(screen.getByText("~End Of Your Feed~")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("StandardPost Component").length).toBe(9);
  });
  it("will show the End Of Feed message if the number of posts  initially gotten is less than the amount of posts requested in the homePostSlice in the redux store", async () => {
    mockPostsRequested = 30;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("~End Of Your Feed~")).toBeInTheDocument();
  });
  it("will show the Load More button if the number of posts initially gotten is equal to or more than the amount of postsRequested", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Home />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
    expect(screen.queryByText("~End Of Your Feed~")).not.toBeInTheDocument();
  });
});
