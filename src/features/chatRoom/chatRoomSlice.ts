import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../user/userSlice";
import { RootState } from "../../app/store";
import { Timestamp } from "firebase/firestore";

export type Message = {
  timestamp: string;
  id: string;
  content: string;
  postedBy: string;
};
export type RecentMessage = {
  content: string;
  timestamp: string;
  sentBy: string;
} | null;
export type Chat = {
  id: string;
  members: string[];
  messages: Message[];
  recentMessage: RecentMessage;
};
type SelectedChat = Chat | null;
const initialState = {
  chats: [] as Chat[],
  selectedChat: null as SelectedChat,
};
export const chatRoomSlice = createSlice({
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

export const selectChats = (state: RootState) => state.chatRoom.chats;
export const getSelectedChat = (state: RootState) =>
  state.chatRoom.selectedChat;
export const { setChats, changeSelectedChat } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
