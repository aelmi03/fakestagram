import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
const initialState: number = 30;
export const explorePostsSlice = createSlice({
  name: "explorePosts",
  initialState,
  reducers: {
    setExplorePostsAmount(state, action: PayloadAction<typeof initialState>) {
      return action.payload;
    },
  },
});

export const selectExplorePostsAmount = (state: RootState) =>
  state.explorePostsRequested;
export const { setExplorePostsAmount } = explorePostsSlice.actions;
export default explorePostsSlice.reducer;
