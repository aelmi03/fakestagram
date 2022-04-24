import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import NewMessageModal from "../../../components/Main/Messages/NewMessageModal";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import { addDoc } from "firebase/firestore";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";
import { Chat, Message } from "../../../features/chatRooms/chatRoomsSlice";
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
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
const mockSecondUser: User = {
  fullName: "Joker",
  username: "joker123",
  following: [],
  savedPosts: [],
  id: "joker",
  profilePicture: "path/to/photo/for/johnDoe23",
  biography: "Love riding bicycles and going to the beach :)",
};
let mockChatExists: boolean;

let mockChat: Chat = {
  messages: [] as Message[],
  members: ["randomFirstUser", "randomSecondUser"],
  recentMessage: null,
  createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
  id: "123",
};
const toggleModal = jest.fn();
jest.mock("firebase/firestore", () => {
  return {
    collection: jest.fn(),
    getFirestore: jest.fn(),
    getDocs: async (arg: string | undefined) => {
      if (arg === "Empty") {
        return { docs: [] };
      }
      if (arg === "Chats") {
        return {
          docs: [
            {
              data: () => mockChat,
            },
          ],
        };
      }
      return {
        docs: [
          {
            data: () => mockFirstUser,
          },
          {
            data: () => mockSecondUser,
          },
        ],
      };
    },

    where: jest.fn((firstArg: string, secondArg: any, thirdArg: any) => {
      return "Chats";
    }),
    addDoc: jest.fn().mockReturnValue({ id: "random" }),
    updateDoc: jest.fn(),
    getDoc: () => {
      return { data: () => mockChat };
    },
    query: jest.fn((firstArg: any, secondArg: string) => {
      if (secondArg) {
        if (mockChatExists) {
          return "Chats";
        } else return "Empty";
      }
    }),
  };
});

jest.mock("../../../app/hooks", () => {
  return {
    ...jest.requireActual("../../../app/hooks"),
    useAppSelector: () => mockUser,
  };
});

describe("NewMessageModal Component", () => {
  beforeEach(() => {
    mockChatExists = false;
    render(
      <ThemeProvider theme={Theme}>
        <Provider store={store}>
          <NewMessageModal toggleModal={toggleModal}></NewMessageModal>
        </Provider>
      </ThemeProvider>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Shows text telling that they must enter a username above to see users if the input is empty", () => {
    expect(
      screen.getByText("You must enter a username above to see users.")
    ).toBeInTheDocument();
  });
  it("shows text saying there are no results if there is no user with a username that matches the input", async () => {
    await act(async () => {
      userEvent.type(screen.getByLabelText("To:"), "z");
    });
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
  it("will properly filter the shown users based on their usernames so the shown users will have usernames that start with the input value, and won't show any users if the input value is empty", async () => {
    expect(screen.queryByTestId("Users Container")).not.toBeInTheDocument();
    await act(async () => {
      userEvent.type(screen.getByLabelText("To:"), "j");
    });
    expect(screen.getByTestId("Users Container")).toBeInTheDocument();
    expect(screen.getByTestId("Users Container").children.length).toBe(2);
    await act(async () => {
      userEvent.clear(screen.getByLabelText("To:"));
    });
    expect(screen.queryByTestId("Users Container")).not.toBeInTheDocument();
  });
  it("will show the correct username, fullname, and correct profile picture for each user", async () => {
    await act(async () => {
      userEvent.type(screen.getByLabelText("To:"), "j");
    });
    const firstUser = screen.getByTestId(`${mockFirstUser.id}`);
    expect(
      within(firstUser).getByText(`${mockFirstUser.username}`)
    ).toBeInTheDocument();
    expect(
      within(firstUser).getByText(`${mockFirstUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      (within(firstUser).getByAltText("Profile Picture") as HTMLImageElement)
        .src
    ).toBe(`http://localhost/${mockFirstUser.profilePicture}`);
    const secondUser = screen.getByTestId(`${mockSecondUser.id}`);
    expect(
      within(secondUser).getByText(`${mockSecondUser.username}`)
    ).toBeInTheDocument();
    expect(
      within(secondUser).getByText(`${mockSecondUser.fullName}`)
    ).toBeInTheDocument();
    expect(
      (within(secondUser).getByAltText("Profile Picture") as HTMLImageElement)
        .src
    ).toBe(`http://localhost/${mockSecondUser.profilePicture}`);
  });
  it("will call the toggleModal when either the Modal Wrapper or the Go Back icon is clicked", () => {
    expect(toggleModal).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId("Go back"));
    expect(toggleModal).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByTestId("Modal Wrapper"));
    expect(toggleModal).toHaveBeenCalledTimes(2);
  });
  it("will not call the addDoc function with a new chat if one already exists and will set the redux selectedChat value to the chat that already exists and then will call the toggleModal function ", async () => {
    mockChatExists = true;
    expect(toggleModal).toHaveBeenCalledTimes(0);
    await act(async () => {
      userEvent.type(screen.getByLabelText("To:"), "j");
    });
    await act(async () => {
      userEvent.click(screen.getByText(mockFirstUser.id));
    });
    expect(addDoc as jest.Mock).not.toHaveBeenCalled();
    expect(store.getState().chatRooms.selectedChat).toEqual(mockChat);
    console.log(mockChat);
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });
  it("will call the addDoc function with the newly created chat and then will set the redux selected chat value to it, and then call the toggleModal function", async () => {
    mockChatExists = false;
    expect(toggleModal).toHaveBeenCalledTimes(0);
    expect(addDoc).toHaveBeenCalledTimes(0);
    mockChat = {
      messages: [] as Message[],
      members: ["mockedFirstUser", "mockedSecondUser"],
      recentMessage: null,
      createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
      id: "41Awkz1",
    };
    await act(async () => {
      userEvent.type(screen.getByLabelText("To:"), "j");
    });
    await act(async () => {
      userEvent.click(screen.getByText(mockFirstUser.id));
    });
    const expectedChatValue: Chat = {
      createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
      id: "",
      members: ["actualUser", "jordan"],
      messages: [],
      recentMessage: null,
    };
    expect({
      ...(addDoc as jest.Mock).mock.calls[0][1],
      createdAt: new Date("2022-09-26T00:00:00.000Z").toString(),
    }).toEqual(expectedChatValue);
    expect(store.getState().chatRooms.selectedChat).toEqual(mockChat);
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });
});
