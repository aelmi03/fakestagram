import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type User = {
  name: string;
};
const initialUser: User = {} as User;
export const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state = action.payload;
    },
  },
});

export const selectUser = (state: RootState) => state.user;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
