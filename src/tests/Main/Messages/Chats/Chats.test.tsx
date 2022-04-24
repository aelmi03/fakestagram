import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import Theme from "../../../../Themes/Theme";
import { Chat, Message } from "../../../../features/chatRooms/chatRoomsSlice";
import { store } from "../../../../app/store";
import Chats from "../../../../components/Main/Messages/Chats/Chats";
import { User } from "../../../../features/user/userSlice";

let mockNavigateFunction = jest.fn();
const mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "actualUser",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockFirstUser: User = {
  fullName: "Michael Jordan",
  username: "jordan",
  following: [],
  savedPosts: [],
  id: "jordan",
  profilePicture: "path/to/photo/for/jordan",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockSecondUser: User = {
  fullName: "Joker",
  username: "joker123",
  following: [],
  savedPosts: [],
  id: "joker",
  profilePicture: "path/to/photo/for/joker",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockFirstChat: Chat = {
  messages: [] as Message[],
  members: ["actualUser", "jordan"],
  recentMessage: null,
  createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
  id: "123",
};
let mockSecondChat: Chat = {
  messages: [] as Message[],
  members: ["actualUser", "joker"],
  recentMessage: {
    content: "Hello, how are you?",
    timestamp: new Date("2022-09-26T00:00:00.000Z").toString(),
    id: "randomMessageID",
    sentBy: "actualUser",
    read: false,
  },
  createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
  id: "1234",
};
let mockChats = [mockFirstChat, mockSecondChat];
const mockUsers = [mockFirstUser, mockSecondUser];
const originalInnerWidth = global.innerWidth;
const toggleModal = jest.fn();
jest.mock("date-fns", () => {
  return { formatDistanceToNow: () => "2h" };
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
    selectChats: () => mockChats,
    __esModule: true,
  };
});

jest.mock("../../../../features/user/userSlice", () => {
  return {
    ...jest.requireActual("../../../../features/user/userSlice"),
    selectAllUsers: () => mockUsers,
    selectUser: () => mockUser,
    __esModule: true,
  };
});

describe("Chats Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockChats = [mockFirstChat, mockSecondChat];
  });
  afterAll(() => {
    global.innerWidth = originalInnerWidth;
  });
  it("is not visible if the hide boolean prop passed in is true", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} hide={true} />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("Chats Wrapper")).not.toBeVisible();
  });
  it("is visible if the hide boolean prop is equal to false", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} hide={false} />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("Chats Wrapper")).toBeVisible();
  });
  it("is visible if the hide boolean prop is not passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("Chats Wrapper")).toBeVisible();
  });
  it("calls the toggleModal function if the Chat Icon is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    expect(toggleModal).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Chat Icon"));
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });
  it("will call the navigate function from the useNavigate hook with the /home route if the Go back icon is clicked", () => {
    global.innerWidth = 540;
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    expect(mockNavigateFunction).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    expect(mockNavigateFunction.mock.calls[0][0]).toEqual("/home");
  });
  it("will render a No Messages text and a Start A Message button which will call the togleModal function when clicked if there are no chats", () => {
    mockChats = [];
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    expect(screen.queryByTestId("Chats Container")).not.toBeInTheDocument();
    expect(screen.getByText("No Messages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start a Message" })
    ).toBeInTheDocument();
    expect(toggleModal).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByRole("button", { name: "Start a Message" }));
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });
  it("renders the correct number of chats", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    expect(
      screen.queryByRole("button", { name: "Start a Message" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("No Messages")).not.toBeInTheDocument();
    expect(screen.getByTestId("Chats Container").children.length).toBe(2);
  });
  it("renders the correct information for each chat, and will show the recent message information if it is not null", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    const firstMockChat = screen.getByTestId(`${mockFirstChat.id}`);
    expect(
      within(firstMockChat).getByText(mockFirstUser.fullName)
    ).toBeInTheDocument();
    expect(
      (within(firstMockChat).getByTestId("Profile Picture") as HTMLImageElement)
        .src
    ).toBe(`http://localhost/${mockFirstUser.profilePicture}`);
    const secondMockChat = screen.getByTestId(`${mockSecondChat.id}`);
    expect(
      within(secondMockChat).getByText(mockSecondUser.fullName)
    ).toBeInTheDocument();
    expect(
      (
        within(secondMockChat).getByTestId(
          "Profile Picture"
        ) as HTMLImageElement
      ).src
    ).toBe(`http://localhost/${mockSecondUser.profilePicture}`);
    expect(
      within(secondMockChat).getByText("Hello, how are you?")
    ).toBeInTheDocument();
    expect(within(secondMockChat).getByText("2h")).toBeInTheDocument();
  });
  it("it will change the selected chat in the chatRoomsSlice inside the redux store to the Chat that is clicked ", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <Chats toggleModal={toggleModal} />
        </Provider>
      </ThemeProvider>
    );
    expect(store.getState().chatRooms.selectedChat).toEqual(null);
    const firstMockChat = screen.getByTestId(`${mockFirstChat.id}`);
    await act(async () => {
      userEvent.click(firstMockChat);
    });
    expect(store.getState().chatRooms.selectedChat).toEqual(mockFirstChat);
  });
});
