import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import { User } from "../../../../features/user/userSlice";
import Theme from "../../../../Themes/Theme";
import { Chat, Message } from "../../../../features/chatRooms/chatRoomsSlice";
