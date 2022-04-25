import { act, render, screen } from "@testing-library/react";
import App from "../App";
import { Provider } from "react-redux";
import { store as reduxStore } from "../app/store";
import { Chat, Message } from "../features/chatRooms/chatRoomsSlice";
import { User } from "../features/user/userSlice";
let mockAuthUserValue: null | string;
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

let mockUser: User = {
  fullName: "John Doe",
  username: "johnDoe23",
  following: [],
  savedPosts: [],
  id: "123",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockSecondUser: User = {
  fullName: "Michael Jordan",
  username: "jordan",
  following: [],
  savedPosts: [],
  id: "jordan",
  profilePicture: "path/to/photo/for/jordan",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockUsers = {
  docs: [
    {
      data: () => mockUser,
    },
    {
      data: () => mockSecondUser,
    },
  ],
};
const mockChats = {
  docs: [
    {
      data: () => mockFirstChat,
    },
    {
      data: () => mockSecondChat,
    },
  ],
};
type mockArguementType =
  | {
      data: () => typeof mockUser;
    }
  | typeof mockChats;
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(),
  };
});
jest.mock("react-firebase-hooks/auth", () => {
  return {
    useAuthState: () => {
      return [mockAuthUserValue];
    },
  };
});

jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    doc: () => "doc",
    collection: jest.fn(),
    where: jest.fn(),
    getDocs: () => mockUsers,
    query: () => "query",
    onSnapshot: jest.fn(
      (firstArg: any, func: (arg: mockArguementType) => void) => {
        if (firstArg === "doc") {
          func({ data: () => mockUser });
        } else if (firstArg === "query") {
          func(mockChats);
        }
      }
    ),
  };
});
jest.mock("../app/store", () => {
  return {
    ...jest.requireActual("../app/store"),
    __esModule: true,
  };
});
jest.mock("../components/Main", () => {
  return () => <div>The Main component is rendered</div>;
});
jest.mock("../components/SignUpAndLogin", () => {
  return () => <div>The SignUpAndLogin component is rendered</div>;
});
describe("App component", () => {
  let store: typeof reduxStore;
  beforeEach(() => {
    return import("../app/store").then((module) => {
      store = module.store;
      jest.resetModules();
    });
  });
  it("renders the Signup page if the useAuthState returns null", () => {
    mockAuthUserValue = null;
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByText(/The SignUpAndLogin component is rendered/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/The Main component is rendered/)
    ).not.toBeInTheDocument();
  });
  it("renders the Main page if the useAuthState doesn't return null", () => {
    mockAuthUserValue = "value is not null";
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByText(/The Main component is rendered/)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/The SignUpAndLogin component is rendered/)
    ).not.toBeInTheDocument();
  });
  it("Sets the user in the redux store if the useAuthState doesn't return null", async () => {
    mockAuthUserValue = "value is not null";
    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
    expect(store.getState().user).toEqual(mockUser);
  });
  it("sets the users in the redux store", async () => {
    expect(store.getState().users).toEqual([]);
    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
    expect(store.getState().users).toEqual([mockUser, mockSecondUser]);
  });
  it("sets the chats in the redux store", async () => {
    mockAuthUserValue = "not null";
    expect(store.getState().chatRooms.chats).toEqual([]);

    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
    expect(store.getState().chatRooms.chats).toEqual([
      mockFirstChat,
      mockSecondChat,
    ]);
    expect(store.getState().chatRooms.selectedChat).toBe(null);
  });
  it("won't set the chats or the users if the user from the redux store hasn't been initialized with values", async () => {
    mockAuthUserValue = null;
    mockUser = {
      fullName: "",
      username: "",
      following: [],
      savedPosts: [],
      id: "",
      profilePicture: "",
      biography: "",
    };
    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
    expect(store.getState().users).toEqual([]);
    expect(store.getState().chatRooms.chats).toEqual([]);
  });
});
