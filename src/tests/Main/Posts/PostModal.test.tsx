import PostModal from "../../../components/Main/Posts/PostModal";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";
import { render, screen } from "@testing-library/react";
import Post from "../../../components/utils/PostInterface";
import { Timestamp } from "firebase/firestore";

const changeModalStatus = jest.fn();
const changePostToShow = jest.fn();
const changeLikesModalStatus = jest.fn();
const mockPost: Post = {
  postedBy: "randomID",
  comments: [],
  likes: [],
  caption: "Went on a trip!",
  timestamp: "faketimestamp" as unknown as Timestamp,
  id: "fakePostID",
  imgSrc: "fakeImgSrc",
};

jest.mock("../../../components/Main/Posts/SmallModal", () => {
  return () => <div>Small Modal Component</div>;
});
jest.mock("../../../components/Main/Posts/LargeModal", () => {
  return () => <div>Large Modal Component</div>;
});
describe("Post Modal Component", () => {
  it("Renders the SmallModal component if the width is smaller than 768px", () => {
    render(
      <ThemeProvider theme={Theme}>
        <PostModal
          post={mockPost}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
          changeLikesModalStatus={changeLikesModalStatus}
          width={767}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("Small Modal Component")).toBeInTheDocument();
    expect(screen.queryByText("Large Modal Component")).not.toBeInTheDocument();
  });
  it("Renders the LargeModal component if the width is greater than or equal to 768px", () => {
    render(
      <ThemeProvider theme={Theme}>
        <PostModal
          post={mockPost}
          changeModalStatus={changeModalStatus}
          changePostToShow={changePostToShow}
          changeLikesModalStatus={changeLikesModalStatus}
          width={768}
        />
      </ThemeProvider>
    );
    expect(screen.getByText("Large Modal Component")).toBeInTheDocument();
    expect(screen.queryByText("Small Modal Component")).not.toBeInTheDocument();
  });
});
