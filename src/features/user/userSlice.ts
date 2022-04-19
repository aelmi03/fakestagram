import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type User = {
  fullName: string;
  username: string;
  id: string;
  profilePicture: string;
  following: string[];
  biography: string;
  savedPosts: string[];
};
const initialUser: User = {
  fullName: "",
  username: "",
  id: "",
  profilePicture: "",
  following: [],
  biography: "",
  savedPosts: [],
} as User;
export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    },
  },
});
export const usersSlice = createSlice({
  name: "users",
  initialState: [] as User[],
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      return action.payload;
    },
  },
});

export const selectAllUsers = (state: RootState) => state.users;
export const { setUsers } = usersSlice.actions;
export const selectUser = (state: RootState) => state.user;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
export const usersReducer = usersSlice.reducer;
