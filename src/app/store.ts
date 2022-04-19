import { configureStore } from "@reduxjs/toolkit";
import chatRoomReducer from "../features/chatRooms/chatRoomsSlice";
import userReducer, { usersReducer } from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    chatRooms: chatRoomReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
