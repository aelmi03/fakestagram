import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "../features/chats/chatsSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
