import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
const initialState: number = 8;
export const homePostsSlice = createSlice({
  name: "homePosts",
  initialState,
  reducers: {
    setHomePostsAmount(state, action: PayloadAction<typeof initialState>) {
      return action.payload;
    },
  },
});

export const selectHomePostsAmount = (state: RootState) =>
  state.homePostsRequested;
export const { setHomePostsAmount } = homePostsSlice.actions;
export default homePostsSlice.reducer;
