import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentData, Query } from "firebase/firestore";
import { RootState } from "../../app/store";

export const homePostsSlice = createSlice({
  name: "users",
  initialState: null as unknown as Query<DocumentData>,
  reducers: {
    setHomePosts(state, action: PayloadAction<Query<DocumentData>>) {
      return action.payload;
    },
  },
});

export const selectHomePosts = (state: RootState) => state.homePosts;
export const { setHomePosts } = homePostsSlice.actions;
export default homePostsSlice.reducer;
