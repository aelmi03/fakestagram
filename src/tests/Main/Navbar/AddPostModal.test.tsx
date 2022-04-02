import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import AddPostModal from "../../../components/Main/Navbar/AddPostModal";
import { addDoc } from "firebase/firestore";

jest.mock("firebase/firestore", () => {
  return {
    addDoc: jest.fn().mockResolvedValue({
      id: "84MHskfh1kSM15",
    }),
    collection: jest.fn(),
    getFirestore: jest.fn(),
    serverTimestamp: jest.fn().mockReturnValue("March 1st 2019"),
    updateDoc: jest.fn(),
  };
});

jest.mock("firebase/storage", () => {
  return {
    getDownloadURL: jest.fn(),
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
  };
});

jest.mock("../../../app/hooks", () => {
  return {
    useAppSelector: jest.fn(() => {
      return {
        fullName: "John Doe",
        username: "johnDoe23",
        following: [],
        id: "123",
        profilePicture: "path/to/photo/for/johnDoe23",
        biography: "Love riding bicycles and going to the beach :)",
        savedPosts: [],
      };
    }),
  };
});
describe("AddPostModal component", () => {
  let toggleAddPostModal: jest.Mock;
  beforeEach(() => {
    toggleAddPostModal = jest
      .fn()
      .mockImplementation((e) => e.preventDefault());
    render(
      <ThemeProvider theme={Theme}>
        <AddPostModal toggleAddPostModal={toggleAddPostModal} />
      </ThemeProvider>
    );
  });
  it("calls the prop function if either the cancel button, or the outer dark container is clicked", () => {
    expect(toggleAddPostModal).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByRole("button", { name: /Cancel/ }));
    expect(toggleAddPostModal).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByTestId("Add Post Wrapper"));
    expect(toggleAddPostModal).toHaveBeenCalledTimes(2);
  });
  it("shows a warning text to the user if they try adding a post without uploading an image file", async () => {
    const pictureFile = new File(["hello"], "hello.png", { type: "image/png" });
    expect(
      screen.queryByText("You must choose a picture to be able to post")
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: /Post/ }));
    expect(
      screen.getByText("You must choose a picture to be able to post")
    ).toBeInTheDocument();
    await act(async () => {
      userEvent.upload(screen.getByLabelText("Picture"), pictureFile);
    });
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: /Post/ }));
    });
    expect(
      screen.queryByText("You must choose a picture to be able to post")
    ).not.toBeInTheDocument();
  });
  it("shows a warning text to the user if they try adding a post with an empty caption", () => {
    expect(
      screen.queryByText(
        "Caption cannot be empty, please enter a valid caption"
      )
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: /Post/ }));
    expect(
      screen.getByText("Caption cannot be empty, please enter a valid caption")
    ).toBeInTheDocument();
    userEvent.type(screen.getByLabelText("Caption"), "my hiking trip :)");
    userEvent.click(screen.getByRole("button", { name: /Post/ }));
    expect(
      screen.queryByText(
        "Caption cannot be empty, please enter a valid caption"
      )
    ).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText("Caption"));
    userEvent.click(screen.getByRole("button", { name: /Post/ }));
    expect(
      screen.getByText("Caption cannot be empty, please enter a valid caption")
    ).toBeInTheDocument();
  });
  it("successfully makes a post and calls the prop function if the user entered a caption, and uploaded an image file", async () => {
    const pictureFile = new File(["hello"], "hello.png", { type: "image/png" });
    expect(toggleAddPostModal).toHaveBeenCalledTimes(0);
    userEvent.type(screen.getByLabelText("Caption"), "Went on a trip!");
    await act(async () => {
      userEvent.upload(screen.getByLabelText("Picture"), pictureFile);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for the file to be read and converted into a proper data url to be put in my postPicture state
    });
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: /Post/ }));
    });
    expect(
      screen.queryByText(
        "Caption cannot be empty, please enter a valid caption"
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("You must choose a picture to be able to post")
    ).not.toBeInTheDocument();
    expect((addDoc as jest.Mock).mock.calls[0][1]).toEqual({
      postedBy: "123",
      comments: [],
      likes: [],
      caption: "Went on a trip!",
      timestamp: "March 1st 2019",
    });
    expect(toggleAddPostModal).toHaveBeenCalledTimes(1);
  });
});
