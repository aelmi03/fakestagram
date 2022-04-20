import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../user/userSlice";
import { RootState } from "../../app/store";
import { Timestamp } from "firebase/firestore";

export type Message = {
  timestamp: string;
  id: string;
  content: string;
  sentBy: string;
};
export type RecentMessage = Message | null;
export type Chat = {
  id: string;
  members: string[];
  createdAt: string;
  messages: Message[];
  recentMessage: RecentMessage;
};
type SelectedChat = Chat | null;
const initialState = {
  chats: [] as Chat[],
  selectedChat: null as SelectedChat,
};
export const chatRoomsSlice = createSlice({
  name: "chatroom",
  initialState: initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    changeSelectedChat(state, action: PayloadAction<SelectedChat>) {
      state.selectedChat = action.payload;
    },
  },
});

export const selectChats = (state: RootState) => state.chatRooms.chats;
export const getSelectedChat = (state: RootState) =>
  state.chatRooms.selectedChat;
export const { setChats, changeSelectedChat } = chatRoomsSlice.actions;
export default chatRoomsSlice.reducer;
