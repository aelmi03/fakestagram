import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";

import Explore from "../../../components/Main/Explore";
import { store } from "../../../app/store";
import { Provider } from "react-redux";

const mockFirstPost: Post = { id: "firstPost" } as Post;
const mockSecondPost: Post = { id: "secondPost" } as Post;
const mockThirdPost: Post = { id: "thirdPost" } as Post;
const mockFourthPost: Post = { id: "fourthPost" } as Post;
const mockFifthPost: Post = { id: "fifthPost" } as Post;
const mockSixthPost: Post = { id: "sixthPost" } as Post;
const mockSeventhPost: Post = { id: "seventhPost" } as Post;
const mockEighthPost: Post = { id: "eighthPost" } as Post;
const mockNinthPost: Post = { id: "ninthPost" } as Post;
const mockTenthPost: Post = { id: "tenthPost" } as Post;

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
jest.mock("firebase/firestore", () => {
  return {
    query: jest.fn(),
    collection: jest.fn(),
    getFirestore: jest.fn(),
    where: jest.fn(),
    getDocs: async () => mockedPosts,
    doc: jest.fn(),
    getDoc: jest.fn(),
    limit: jest.fn(),
    QuerySnapshot: jest.fn(),
    startAfter: jest.fn(),
    DocumentData: jest.fn(),
    orderBy: jest.fn(),
    onSnapshot: jest.fn().mockReturnValue(() => {
      return () => {};
    }),
  };
});
jest.mock("../../../components/Main/Posts/StandardPost", () => {
  interface MockProps {
    post: Post;
    changePostToShow: (post: Post | null) => void;
    removePost: (id: string) => void;
  }
  return ({ post, changePostToShow, removePost }: MockProps) => (
    <div data-testid={post.id} onClick={() => changePostToShow(null)}>
      StandardPost Component
      <h1>{post.id}</h1>
      <button onClick={() => removePost(post.id)}>Remove Post</button>
    </div>
  );
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
jest.mock("../../../components/Main/Posts/PostPreview", () => {
  interface MockProps {
    post: Post;
    changePostToShow: (post: Post) => void;
  }
  return ({ post, changePostToShow }: MockProps) => (
    <div data-testid={post.id} onClick={() => changePostToShow(post)}>
      PostPreview
    </div>
  );
});
jest.mock("../../../features/explorePosts/explorePostsSlice", () => {
  return {
    ...jest.requireActual("../../../features/explorePosts/explorePostsSlice"),
    selectExplorePostsAmount: () => {
      return mockPostsRequested;
    },
    __esModule: true,
  };
});
describe("Explore component", () => {
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
        {
          data: () => mockNinthPost,
        },
        {
          data: () => mockTenthPost,
        },
      ],
    };
    mockPostsRequested = 10;
  });
  it("renders the correct amount of PostPreview components", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getAllByText("PostPreview").length).toBe(10);
  });
  it("doesn't render a Load More button and will render a text saying No More Posts if the initial fetch of posts is less than the posts requested number in the explorePostsSlice", async () => {
    mockPostsRequested = 11;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getByText("~No More Posts~")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
  });
  it("will render a Load More button and will not render a text saying No More Posts if the initial fetch of posts is equal to or more than the posts requested number in the explorePostsSlice", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.queryByText("~No More Posts~")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
  });
  it("will show a StandardPost component with the post value from the Post Preview component that is clicked, and will unrender the StandardPost component if the changePostToShow prop function is called with null", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(
      screen.queryByText("StandardPost Component")
    ).not.toBeInTheDocument();
    userEvent.click(
      within(screen.getByTestId("Posts Container")).getByTestId(
        `${mockFirstPost.id}`
      )
    );
    expect(screen.getByText("StandardPost Component")).toBeInTheDocument();
    expect(
      within(screen.getByText("StandardPost Component")).getByText(
        `${mockFirstPost.id}`
      )
    ).toBeInTheDocument();
    userEvent.click(screen.getByText("StandardPost Component"));
    expect(
      screen.queryByText("StandardPost Component")
    ).not.toBeInTheDocument();
  });
  it("is able to remove a post", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    userEvent.click(
      within(screen.getByTestId("Posts Container")).getByTestId(
        `${mockFirstPost.id}`
      )
    );
    expect(screen.getAllByText("PostPreview").length).toBe(10);
    expect(
      within(screen.getByTestId("Posts Container")).getByTestId(
        `${mockFirstPost.id}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText("StandardPost Component")).toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Remove Post" }));
    expect(
      screen.queryByText("StandardPost Component")
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("PostPreview").length).toBe(9);
    expect(
      within(screen.getByTestId("Posts Container")).queryByTestId(
        `${mockFirstPost.id}`
      )
    ).not.toBeInTheDocument();
  });
  it("doesn't render a Load More button and will render a text saying No More Posts if the amount of posts fetched when the Load More button is less than 10", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    const mockEleventhPost: Post = { id: "eleventhPost" } as Post;
    mockedPosts = {
      docs: [
        {
          data: () => mockEleventhPost,
        },
      ],
    };
    expect(screen.getAllByText("PostPreview").length).toBe(10);
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Load More" }));
    });
    expect(screen.getByText("~No More Posts~")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("PostPreview").length).toBe(11);
  });
  it("will render a Load More button and will not render text saying No More Posts if the amount of posts fetched when the Load More button is equal to or more than 10", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Explore />
          </Provider>
        </ThemeProvider>
      );
    });
    const mockEleventhPost: Post = { id: "eleventhPost" } as Post;
    const mockTwelfthPost: Post = { id: "twelfthPost" } as Post;
    const mockThirteenthPost: Post = { id: "thirteenthPost" } as Post;
    const mockFourteenthPost: Post = { id: "fourteenthPost" } as Post;
    const mockFifteenthPost: Post = { id: "fifteenthPost" } as Post;
    const mockSixteenthPost: Post = { id: "sixteenthPost" } as Post;
    const mockSeventeenthPost: Post = { id: "seventeenthPost" } as Post;
    const mockEighteenthPost: Post = { id: "eigtheenthPost" } as Post;
    const mockNineteenthPost: Post = { id: "nineteenthPost" } as Post;
    const mockTwentiethPost: Post = { id: "twentiethPost" } as Post;

    mockedPosts = {
      docs: [
        {
          data: () => mockEleventhPost,
        },
        {
          data: () => mockTwelfthPost,
        },
        {
          data: () => mockThirteenthPost,
        },
        {
          data: () => mockFourteenthPost,
        },
        {
          data: () => mockFifteenthPost,
        },
        {
          data: () => mockSixteenthPost,
        },
        {
          data: () => mockSeventeenthPost,
        },
        {
          data: () => mockEighteenthPost,
        },
        {
          data: () => mockNineteenthPost,
        },
        {
          data: () => mockTwentiethPost,
        },
      ],
    };
    expect(screen.getAllByText("PostPreview").length).toBe(10);
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: "Load More" }));
    });
    expect(screen.queryByText("~No More Posts~")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Load More" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("PostPreview").length).toBe(20);
  });
});
