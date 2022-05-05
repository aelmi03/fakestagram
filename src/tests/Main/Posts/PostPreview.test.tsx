import { render, screen } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import Theme from "../../../Themes/Theme";
import PostPreview from "../../../components/Main/Posts/PostPreview";
import { ThemeProvider } from "styled-components";
import Post from "../../../components/utils/PostInterface";
import userEvent from "@testing-library/user-event";
let mockPost: Post = {
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
const changePostToShow = jest.fn();
describe("PostPreview Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("shows the correct image", () => {
    render(
      <ThemeProvider theme={Theme}>
        <PostPreview post={mockPost} changePostToShow={changePostToShow} />
      </ThemeProvider>
    );
    expect(
      (screen.getByTestId("Post Preview Image") as HTMLImageElement).src
    ).toBe(`http://localhost/${mockPost.imgSrc}`);
  });
  it("shows the correct amount of likes and comments for a post", () => {
    render(
      <ThemeProvider theme={Theme}>
        <PostPreview post={mockPost} changePostToShow={changePostToShow} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("comments")).toHaveTextContent("3");
    expect(screen.getByTestId("likes")).toHaveTextContent("5");
  });
  it("calls the changePostToShow prop function when it is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <PostPreview post={mockPost} changePostToShow={changePostToShow} />
      </ThemeProvider>
    );
    expect(changePostToShow).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId(`${mockPost.id}`));
    expect(changePostToShow).toHaveBeenCalledTimes(1);
  });
});
