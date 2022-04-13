import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Timestamp, updateDoc } from "firebase/firestore";
import Post from "../../../components/utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import AddComment from "../../../components/Main/Posts/AddComment";
import Theme from "../../../Themes/Theme";
import userEvent from "@testing-library/user-event";

jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn(),
    getFirestore: jest.fn(),
    updateDoc: jest.fn(),
  };
});
jest.mock("@reduxjs/toolkit", () => {
  return {
    nanoid: () => "randomCommentID",
  };
});
const fakeUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "fakeUserID",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
jest.mock("../../../features/user/userSlice", () => {
  return {
    selectUser: () => {},
  };
});
jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: () => fakeUser,
  };
});
const mockDate = new Date("2022-09-26T00:00:00.000Z");
let spy = jest.spyOn(global, "Date").mockImplementation((): any => {
  return mockDate;
});
describe("AddComment component", () => {
  beforeEach(() => {
    const fakePost: Post = {
      postedBy: "randomID",
      comments: [],
      likes: [],
      caption: "Went on a trip!",
      timestamp: "faketimestamp" as unknown as Timestamp,
      id: "fakePostID",
      imgSrc: "fakeImgSrc",
    };

    render(
      <ThemeProvider theme={Theme}>
        <AddComment post={fakePost} />
      </ThemeProvider>
    );
  });
  it("does not call the updateDoc function if the user tries to post an empty comment", async () => {
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
    await act(async () => {
      userEvent.click(screen.getByText("Post"));
    });
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
  });
  it("calls the updateDoc function with the correct arguements if the user tries to post a comment that is not empty", async () => {
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
    userEvent.type(screen.getByRole("textbox"), "awesome picture :)");
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
    await act(async () => {
      userEvent.click(screen.getByText("Post"));
    });
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(1);
    expect((updateDoc as jest.Mock).mock.calls[0][1]).toEqual({
      comments: [
        {
          content: "awesome picture :)",
          id: "randomCommentID",
          timestamp: mockDate,
          user: "fakeUserID",
        },
      ],
    });
    expect(screen.getByRole("textbox")).toHaveValue("");
    spy.mockRestore();
  });
});
