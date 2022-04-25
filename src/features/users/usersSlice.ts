import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../user/userSlice";

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
export default usersSlice.reducer;
