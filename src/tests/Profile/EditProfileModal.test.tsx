import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import { updateDoc } from "firebase/firestore";
import EditProfileModal from "../../components/Main/Profile/EditProfileModal";
import React from "react";

jest.mock("firebase/storage", () => {
  return {
    ref: jest.fn(),
    getStorage: jest.fn(),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: async () =>
      "some random path to the storage for the user's profile picture",
  };
});

jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn(),
    getFirestore: jest.fn(),
    updateDoc: jest.fn(),
  };
});

jest.mock("../../app/hooks", () => {
  return {
    useAppSelector: () => {
      return {
        fullName: "John Doe",
        username: "johnDoe23",
        followers: [],
        following: [],
        id: "123",
        profilePicture: "path/to/photo/for/johnDoe23",
        biography: "Love riding bicycles and going to the beach :)",
      };
    },
  };
});

describe("EditProfileModal compoennt", () => {
  let toggleEditProfileModal: jest.Mock;
  beforeEach(() => {
    toggleEditProfileModal = jest
      .fn()
      .mockImplementation((e) => e.preventDefault());
    render(
      <ThemeProvider theme={Theme}>
        <EditProfileModal toggleEditProfileModal={toggleEditProfileModal} />
      </ThemeProvider>
    );
  });
  it("calls the prop function if the cancel button or the outer container is clicked", () => {
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Wrapper"));
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(2);
  });
  it("shows a warning text to the user if they try submitting the form with an empty full name and will not call the prop function", async () => {
    const fullNameInput = screen.getByLabelText(
      "Full Name"
    ) as HTMLInputElement;

    userEvent.clear(fullNameInput);
    userEvent.click(screen.getByRole("button", { name: /Save/ }));
    expect(
      screen.getByText(/Please enter a valid full name that is not empty/)
    ).toBeInTheDocument();
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(0);
  });
  it("will update the user's full name, biography, and profile picture if the form requirements are fulfilled and the user has uploaded a file, and will also call the prop function at the end", async () => {
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(0);
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    await act(async () => {
      userEvent.upload(screen.getByLabelText("Profile Picture"), file);
    });
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: /Save/ }));
    });
    expect((updateDoc as jest.Mock).mock.calls[0][1]).toEqual({
      fullName: "John Doe",
      biography: "Love riding bicycles and going to the beach :)",
      profilePicture:
        "some random path to the storage for the user's profile picture",
    });
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(1);
  });
  it("will update the user's full name, and biography if the form requirements are fulfilled and the user hasn't uploaded a file, and will also call the prop function at the end", async () => {
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(0);
    await act(async () => {
      userEvent.click(screen.getByRole("button", { name: /Save/ }));
    });
    expect((updateDoc as jest.Mock).mock.calls[0][1]).toEqual({
      fullName: "John Doe",
      biography: "Love riding bicycles and going to the beach :)",
    });
    expect(toggleEditProfileModal).toHaveBeenCalledTimes(1);
  });
});
