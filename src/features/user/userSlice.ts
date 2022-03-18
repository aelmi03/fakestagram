import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type User = {
  fullName: string;
  username: string;
  id: string;
  profilePicture: string;
};
const initialUser: User = {} as User;
export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      console.log("User signed in");
      console.log(action.payload);
      state = action.payload;
    },
  },
});

export const selectUser = (state: RootState) => state.user;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
