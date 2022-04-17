import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../user/userSlice";
import { RootState } from "../../app/store";
import { Timestamp } from "firebase/firestore";

export type Message = {
  timestamp: Timestamp;
  id: string;
  content: string;
  postedBy: string;
};
export type Chat = {
  members: User[];
  messages: Message[];
  recentMessage: {
    content: string;
    timestamp: Timestamp;
    sentBy: string;
  };
};
const initialChats: Chat[] = [];
export const chatsSlice = createSlice({
  name: "chats",
  initialState: initialChats,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      return action.payload;
    },
  },
});

export const selectChats = (state: RootState) => state.chats;
export const { setChats } = chatsSlice.actions;
export default chatsSlice.reducer;
