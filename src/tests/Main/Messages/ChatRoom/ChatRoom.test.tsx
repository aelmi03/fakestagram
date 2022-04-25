import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import Theme from "../../../../Themes/Theme";
import {
  changeSelectedChat,
  Chat,
  Message,
} from "../../../../features/chatRooms/chatRoomsSlice";
import { store } from "../../../../app/store";
import ChatRoom from "../../../../components/Main/Messages/ChatRoom";
import { nanoid } from "@reduxjs/toolkit";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { User } from "../../../../features/user/userSlice";
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "john",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockOtherUser: User = {
  fullName: "Michael Jordan",
  username: "jordan",
  following: [],
  savedPosts: [],
  id: "jordan",
  profilePicture: "path/to/photo/for/jordan",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockDate = new Date("2022-09-26T00:00:00.000Z");
let spy = jest.spyOn(global, "Date").mockImplementation((): any => {
  return mockDate;
});

let mockChat: Chat | null;
const toggleModal = jest.fn();
Element.prototype.scrollTo = jest.fn();
let mockNavigateFunction = jest.fn();

jest.mock("@reduxjs/toolkit", () => {
  return {
    ...jest.requireActual("@reduxjs/toolkit"),
    nanoid: () => "randomlyGeneratedNanoID",
  };
});
jest.mock("react-router-dom", () => {
  return {
    useNavigate: jest.fn(() => {
      return mockNavigateFunction;
    }),
  };
});
jest.mock("../../../../features/chatRooms/chatRoomsSlice", () => {
  return {
    ...jest.requireActual("../../../../features/chatRooms/chatRoomsSlice"),
    getSelectedChat: () => mockChat,
    changeSelectedChat: jest.fn(
      jest.requireActual("../../../../features/chatRooms/chatRoomsSlice")
        .changeSelectedChat
    ),
    __esModule: true,
  };
});

jest.mock("../../../../features/user/userSlice", () => {
  return {
    ...jest.requireActual("../../../../features/user/userSlice"),
    selectUser: () => mockUser,
    __esModule: true,
  };
});
jest.mock("../../../../features/users/usersSlice", () => {
  return {
    ...jest.requireActual("../../../../features/users/usersSlice"),
    selectAllUsers: () => [mockOtherUser],
    __esModule: true,
  };
});
jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn(),
    getFirestore: jest.fn(),
    updateDoc: jest.fn(),
  };
});
describe("ChatRoom Component", () => {
  beforeEach(() => {
    mockChat = {
      messages: [
        {
          timestamp: "randomDate",
          id: "firstMessageID",
          content: "Hello, how are you?",
          sentBy: "jordan",
        },
        {
          timestamp: "randomDate",
          id: "secondMessageID",
          content: "I am good, and how about you?",
          sentBy: "john",
        },
      ] as Message[],
      members: ["jordan", "john"],
      recentMessage: null,
      createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
      id: "123",
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    spy.mockRestore();
  });
  it("renders a ChatRoom Container if there is a selected chat with the correct numbers of messages", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId("ChatRoom Container")).toBeInTheDocument();
    expect(screen.getByTestId("ChatRoom Container").children.length).toBe(2);
    expect(
      screen.queryByTestId("NoSelectedChat Container")
    ).not.toBeInTheDocument();
  });
  it("renders a NoSelectedChat Container if there is no selected chat, which has text that tells the user to send a message to a friend, and a Send Message button that calls the toggleModal function when clicked", async () => {
    mockChat = null;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId("NoSelectedChat Container")).toBeInTheDocument();
    expect(screen.queryByTestId("ChatRoom Container")).not.toBeInTheDocument();
    expect(toggleModal).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Send messages to a friend.")).toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });
  it("renders the messages with the correct content", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    const chatMessagesContainer = screen.getByTestId("ChatMessages Container");
    const firstMessage = within(chatMessagesContainer).getByTestId(
      "firstMessageID"
    );
    expect(firstMessage).toHaveTextContent("Hello, how are you?");
    const secondMessage = within(chatMessagesContainer).getByTestId(
      "secondMessageID"
    );
    expect(secondMessage).toHaveTextContent("I am good, and how about you?");
  });
  it("will not call the updateDoc when the Send text is clicked if the message is empty", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    userEvent.click(screen.getByText("Send"));
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
  });
  it("will call the updateDoc with the correct arguments when the Send text is clicked if the message is not empty, and will clear the input", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
    userEvent.type(
      screen.getByPlaceholderText("Message..."),
      "What sport is your favourite?"
    );
    await act(async () => {
      userEvent.click(screen.getByText("Send"));
    });
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(1);
    expect((updateDoc as jest.Mock).mock.calls[0][1]).toEqual({
      messages: [
        ...mockChat!.messages,
        {
          timestamp: new Date().toString(),
          sentBy: "john",
          id: "randomlyGeneratedNanoID",
          content: "What sport is your favourite?",
        },
      ],
      recentMessage: {
        timestamp: new Date().toString(),
        sentBy: "john",
        id: "randomlyGeneratedNanoID",
        content: "What sport is your favourite?",
        read: false,
      },
    });
  });
  it("will call the updateDoc with the a recent message object with the read status set to true if the most recent message is from the other user and it's read status is false", async () => {
    mockChat!.recentMessage = {
      ...mockChat!.messages[mockChat!.messages.length - 1],
      sentBy: "jordan",
      read: false,
    };
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(0);
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(updateDoc as jest.Mock).toHaveBeenCalledTimes(1);
    expect((updateDoc as jest.Mock).mock.calls[0][1]).toEqual({
      recentMessage: {
        ...mockChat!.recentMessage,
        read: true,
      },
    });
  });
  it("will call the navigate function to the other's user account if there user name or profile picture is clicked", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(mockNavigateFunction).toHaveBeenCalledTimes(0);
    userEvent.click(
      screen.getByTestId("Profile Picture and Username Container")
    );
    expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    expect(mockNavigateFunction.mock.calls[0][0]).toBe(
      `/profile/${mockOtherUser.id}`
    );
  });
  it("will call the changeSelectedChat function with the value of null when the Go Back icon is clicked", async () => {
    const originalDateNow = Date.now;
    Date.now = () => 123;
    await act(async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <ChatRoom toggleModal={toggleModal} />
          </Provider>
        </ThemeProvider>
      );
    });
    expect(changeSelectedChat as unknown as jest.Mock).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(changeSelectedChat as unknown as jest.Mock).toHaveBeenCalledTimes(1);
    expect((changeSelectedChat as unknown as jest.Mock).mock.calls[0][0]).toBe(
      null
    );
    Date.now = originalDateNow;
  });
});
