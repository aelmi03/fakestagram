import { render, screen } from "@testing-library/react";
import Theme from "../../../Themes/Theme";
import { ThemeProvider } from "styled-components";
import Comments from "../../../components/Main/Posts/Comments";
import { Timestamp } from "firebase/firestore";
import { Comment as IComment } from "../../../components/utils/PostInterface";
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
jest.mock("../../../components/Main/Posts/Comment", () => {
  return ({ comment }: { comment: IComment }) => <div>{comment.content}</div>;
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
