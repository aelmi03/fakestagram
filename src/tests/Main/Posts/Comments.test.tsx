import { act, render, screen } from "@testing-library/react";
import Theme from "../../../Themes/Theme";
import { ThemeProvider } from "styled-components";
import Comments from "../../../components/Main/Posts/Comments";
import { User } from "../../../features/user/userSlice";
import { Timestamp } from "firebase/firestore";
import Post from "../../../components/utils/PostInterface";
const fakePost: Post = {
  postedBy: "randomID",
  comments: [
    {
      content: "this is the first comment",
      id: "firstCommentID",
      user: "fakeUserID",
      timestamp: {
        toDate: () => new Date("2021-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the second comment",
      id: "secondCommentID",
      user: "fakeUserID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
    {
      content: "this is the third comment",
      id: "thirdCommentID",
      user: "fakeUserID",
      timestamp: {
        toDate: () => new Date("2022-09-26T00:00:00.000Z"),
      } as unknown as Timestamp,
    },
  ],
  likes: [],
  caption: "Went on a trip!",
  timestamp: "faketimestamp" as unknown as Timestamp,
  id: "fakePostID",
  imgSrc: "fakeImgSrc",
};
const fakeUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn(),
    getDoc: jest.fn(),
    getFirestore: jest.fn(),
  };
});
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {}),
  };
});
jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: (func: () => void) => func(),
  };
});

jest.mock("../../../features/users/usersSlice", () => {
  return {
    selectAllUsers: () => [fakeUser],
  };
});
describe("Comments component", () => {
  it("renders the correct amount of comments with the corerct information", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Comments post={fakePost} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("Comments Wrapper").children.length).toBe(3);
    expect(screen.getByText("this is the first comment")).toBeInTheDocument();
    expect(screen.getByText("this is the second comment")).toBeInTheDocument();
    expect(screen.getByText("this is the third comment")).toBeInTheDocument();
  });
});
