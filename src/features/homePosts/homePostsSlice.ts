import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
const initialState = {
  postsRequested: 8,
};
export const homePostsSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setHomePosts(state, action: PayloadAction<typeof initialState>) {
      return action.payload;
    },
  },
});

export const selectHomePosts = (state: RootState) => state.homePosts;
export const { setHomePosts } = homePostsSlice.actions;
export default homePostsSlice.reducer;
