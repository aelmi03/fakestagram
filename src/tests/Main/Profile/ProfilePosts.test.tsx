import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import ProfilePosts from "../../../components/Main/Profile/ProfilePosts";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";

let mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockFirstSavedPost: Post = {
  postedBy: "randomID",
  comments: [
    {
      content: "this is the first comment",
      id: "firstCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2021-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the second comment",
      id: "secondCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the third comment",
      id: "thirdCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
  ],
  likes: ["like", "like", "like", "like", "like"],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "mockFirstSavedPost",
  imgSrc: "fakeImgSrc",
};
let mockSecondSavedPost: Post = {
  postedBy: "randomID",
  comments: [
    {
      content: "this is the first comment",
      id: "firstCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2021-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the second comment",
      id: "secondCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
  ],
  likes: ["like", "like", "like"],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "mockSecondSavedPost",
  imgSrc: "fakeImgSrc",
};
let mockFirstOwnPost: Post = {
  postedBy: "randomID",
  comments: [
    {
      content: "this is the first comment",
      id: "firstCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2021-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
  ],
  likes: ["like", "like"],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "mockFirstOwnPost",
  imgSrc: "fakeImgSrc",
};
let mockSecondOwnPost: Post = {
  postedBy: "randomID",
  comments: [],
  likes: ["like", "like", "like", "like", "like", "like", "like", "like"],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "mockSecondOwnPost",
  imgSrc: "fakeImgSrc",
};
let mockThirdOwnPost: Post = {
  postedBy: "randomID",
  comments: [
    {
      content: "this is the first comment",
      id: "firstCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2021-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the second comment",
      id: "secondCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the third comment",
      id: "thirdCommentID",
      user: "randomID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
  ],
  likes: ["like"],
  caption: "Went on a trip!",
  timestamp: {
    toDate: () => "faketimestamp" as unknown as Date,
  } as unknown as Timestamp,
  id: "mockThirdOwnPost",
  imgSrc: "fakeImgSrc",
};
const savedPosts = {
  docs: [
    {
      data: () => mockFirstSavedPost,
    },
    {
      data: () => mockSecondSavedPost,
    },
  ],
};

const ownPosts = {
  docs: [
    {
      data: () => mockFirstOwnPost,
    },
    {
      data: () => mockSecondOwnPost,
    },
    {
      data: () => mockThirdOwnPost,
    },
  ],
};
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    onSnapshot: jest.fn(
      (
        firstArg: string,
        secondArg: (snapshot: typeof ownPosts | typeof savedPosts) => void
      ) => {
        if (firstArg === "Own Posts") {
          secondArg(ownPosts);
        } else {
          secondArg(savedPosts);
        }
        return () => {};
      }
    ),
    query: jest.fn((firstArg: any, secondArg: string) => secondArg),
    collection: jest.fn(),
    where: jest.fn((firstArg: string, secondArg: any, thirdArg: any) => {
      if (firstArg === "id") {
        return "Saved Posts";
      } else {
        return "Own Posts";
      }
    }),
  };
});
jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: () => mockUser,
  };
});

describe("ProfilePosts component", () => {
  let changePostToShow: jest.Mock;
  beforeEach(() => {
    changePostToShow = jest.fn((post: Post | null) => {});
  });
  it("shows the saved posts option if the user is viewing their own profile", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ProfilePosts
          profileUser={mockUser}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("SAVED POSTS")).toBeInTheDocument();
  });
  it("doesn't show the saved posts option if the user is viewing their someone else's profile", () => {
    let secondMockUser: User = {
      fullName: "John Doe",
      username: "johnDoe23",
      following: [],
      savedPosts: [],
      id: "secondFakeUserID",
      profilePicture: "path/to/photo/for/johnDoe23",
      biography: "Love riding bicycles and going to the beach :)",
    };
    render(
      <ThemeProvider theme={Theme}>
        <ProfilePosts
          profileUser={secondMockUser}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.queryByText("SAVED POSTS")).not.toBeInTheDocument();
  });
  it("calls the changePostToShow with the correct arguement when a Profile Post is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ProfilePosts
          profileUser={mockUser}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(changePostToShow).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("mockFirstOwnPost"));
    expect(changePostToShow).toHaveBeenCalledTimes(1);
    expect(changePostToShow.mock.calls[0][0]).toEqual(mockFirstOwnPost);
  });
  it("it is able to render the Saved Posts when the SAVED Text is clicked and will render the Profile User's Own Posts when the POSTS text is clicked", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ProfilePosts
          profileUser={mockUser}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Posts Container").children.length).toEqual(3);
    await new Promise((resolve) => setTimeout(resolve, 0)); //This is done to let the asynchronous function in the useEffect run
    userEvent.click(screen.getByText("SAVED POSTS"));
    expect(screen.getByTestId("Posts Container").children.length).toEqual(2);
    await new Promise((resolve) => setTimeout(resolve, 0));
    userEvent.click(screen.getByText("POSTS"));
    expect(screen.getByTestId("Posts Container").children.length).toEqual(3);
    await new Promise((resolve) => setTimeout(resolve, 0)); //This is done to let the asynchronous function in the useEffect run
    userEvent.click(screen.getByText("SAVED POSTS"));
    expect(screen.getByTestId("Posts Container").children.length).toEqual(2);
  });
  it("renders the correct number of likes and comments for each post", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ProfilePosts
          profileUser={mockUser}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Posts Container").children.length).toEqual(3);
    const firstPost = screen.getByTestId("mockFirstOwnPost");
    expect(within(firstPost).getByTestId("comments")).toHaveTextContent("1");
    expect(within(firstPost).getByTestId("likes")).toHaveTextContent("2");
    const secondPost = screen.getByTestId("mockSecondOwnPost");
    expect(within(secondPost).getByTestId("comments")).toHaveTextContent("0");
    expect(within(secondPost).getByTestId("likes")).toHaveTextContent("8");
    const thirdPost = screen.getByTestId("mockThirdOwnPost");
    expect(within(thirdPost).getByTestId("comments")).toHaveTextContent("3");
    expect(within(thirdPost).getByTestId("likes")).toHaveTextContent("1");
  });
  it("is able to render the correct of likes and comments for each saved post whent the SAVED text is clicked", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ProfilePosts
          profileUser={mockUser}
          changePostToShow={changePostToShow}
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Posts Container").children.length).toEqual(3);
    await new Promise((resolve) => setTimeout(resolve, 0)); //This is done to let the asynchronous function in the useEffect run before clicking SavedPosts
    userEvent.click(screen.getByText("SAVED POSTS"));
    expect(screen.getByTestId("Posts Container").children.length).toEqual(2);
    const firstPost = screen.getByTestId("mockFirstSavedPost");
    expect(within(firstPost).getByTestId("comments")).toHaveTextContent("3");
    expect(within(firstPost).getByTestId("likes")).toHaveTextContent("5");
    const secondPost = screen.getByTestId("mockSecondSavedPost");
    expect(within(secondPost).getByTestId("comments")).toHaveTextContent("2");
    expect(within(secondPost).getByTestId("likes")).toHaveTextContent("3");
  });
});
