import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import NewMessageModal from "../../../components/Main/Messages/NewMessageModal";
import Chats from "../../../components/Main/Messages/Chats";
import ChatRoom from "../../../components/Main/Messages/ChatRoom";
import { useAppSelector } from "../../../app/hooks";
import { User } from "../../../features/user/userSlice";
import Theme from "../../../Themes/Theme";
import Messages from "../../../components/Main/Messages";
let mockSelectedChat: null | Object;
jest.mock("../../../app/hooks", () => {
  return { useAppSelector: () => mockSelectedChat };
});
jest.mock("../../../components/Main/Messages/NewMessageModal", () => {
  return ({ toggleModal }: { toggleModal: () => void }) => (
    <div onClick={toggleModal}>NewMessageModal Component</div>
  );
});
jest.mock("../../../components/Main/Messages/Chats", () => {
  return ({
    toggleModal,
    hide,
  }: {
    toggleModal: () => void;
    hide: boolean;
  }) => (
    <div onClick={toggleModal}>
      Chats Component
      {hide ? <p>Chats is hidden</p> : <p>Chats is not hidden</p>}
    </div>
  );
});
jest.mock("../../../components/Main/Messages/ChatRoom", () => {
  return ({ toggleModal }: { toggleModal: () => void }) => (
    <div>ChatRoom Component</div>
  );
});
const originalInnerWidth = global.innerWidth;
describe("Messages Component", () => {
  beforeEach(() => {
    mockSelectedChat = null;
  });
  afterAll(() => {
    global.innerWidth = originalInnerWidth;
  });
  it("renders only the Chats Component with the hide prop boolean as false if their is no chats selected and the screen width is smaller than 768px", () => {
    global.innerWidth = 540;
    render(
      <ThemeProvider theme={Theme}>
        <Messages />
      </ThemeProvider>
    );
    expect(screen.getByText("Chats Component")).toBeInTheDocument();
    expect(screen.getByText("Chats is not hidden")).toBeInTheDocument();
    expect(screen.queryByText("Chats is hidden")).not.toBeInTheDocument();

    expect(screen.queryByText("ChatRoom Component")).not.toBeInTheDocument();
  });
  it("renders both the ChatRoom component and Chats component with the hide prop boolean as true if their is a chat selected and the screen width is smaller than 768px", () => {
    global.innerWidth = 540;
    mockSelectedChat = {};
    render(
      <ThemeProvider theme={Theme}>
        <Messages />
      </ThemeProvider>
    );
    expect(screen.getByText("ChatRoom Component")).toBeInTheDocument();
    expect(screen.getByText("Chats Component")).toBeInTheDocument();
    expect(screen.getByText("Chats is hidden")).toBeInTheDocument();
    expect(screen.queryByText("Chats is not hidden")).not.toBeInTheDocument();
  });
  it("renders both the ChatRoom component, and Chats component with the hide prop boolean as false if the screen width is greater than or equal to 768px", () => {
    global.innerWidth = 768;
    render(
      <ThemeProvider theme={Theme}>
        <Messages />
      </ThemeProvider>
    );
    expect(screen.getByText("ChatRoom Component")).toBeInTheDocument();
    expect(screen.getByText("Chats Component")).toBeInTheDocument();
    expect(screen.queryByText("Chats is hidden")).not.toBeInTheDocument();
    expect(screen.queryByText("Chats is not hidden")).toBeInTheDocument();
  });
  it("it toggles the NewMessageModal component when the toggleModal prop function is called", () => {
    global.innerWidth = 768;
    render(
      <ThemeProvider theme={Theme}>
        <Messages />
      </ThemeProvider>
    );
    expect(
      screen.queryByText("NewMessageModal Component")
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByText("Chats Component"));
    expect(screen.getByText("NewMessageModal Component")).toBeInTheDocument();
    userEvent.click(screen.getByText("NewMessageModal Component"));
    expect(
      screen.queryByText("NewMessageModal Component")
    ).not.toBeInTheDocument();
  });
});
