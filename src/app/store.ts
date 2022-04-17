import { configureStore } from "@reduxjs/toolkit";
import chatRoomReducer from "../features/chats/chatRoomSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chatRoom: chatRoomReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
