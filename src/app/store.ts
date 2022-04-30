import { configureStore } from "@reduxjs/toolkit";
import chatRoomReducer from "../features/chatRooms/chatRoomsSlice";
import userReducer from "../features/user/userSlice";
import usersReducer from "../features/users/usersSlice";
import homePosts from "../features/homePosts/homePostsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    chatRooms: chatRoomReducer,
    homePosts: homePosts,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
