import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentData, Query, QuerySnapshot } from "firebase/firestore";
import Post from "../../components/utils/PostInterface";
import { RootState } from "../../app/store";
const initialState = {
  posts: [] as Post[],
  recentSnapshot: null as null | QuerySnapshot<DocumentData>,
  postsRequested: 0,
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
