import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type User = {
  fullName: string;
  username: string;
  id: string;
  profilePicture: string;
  following: string[];
  biography: string;
  savedPosts: [];
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

export const selectUser = (state: RootState) => state.user;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
