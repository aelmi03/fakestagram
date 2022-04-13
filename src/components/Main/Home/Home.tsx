import styled from "styled-components";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import React, { useState, useEffect } from "react";
import {
  query,
  collection,
  getFirestore,
  where,
  getDocs,
  doc,
  getDoc,
  limit,
  QuerySnapshot,
  startAfter,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import StandardPost from "../Posts/StandardPost";
import Button from "../../utils/Button";
import Loader from "../../utils/Loader";
import { PostText } from "../../utils/Texts";
import Suggestions from "./Suggestions";
import SuggestionsList from "./SuggestionsList";
import Post from "../../utils/PostInterface";
interface PostQuery {
  post: Post;
  postUser: User;
}
const Home = () => {
  const user = useAppSelector(selectUser);
  const [showNoMorePostsText, setShowNoMorePostsText] = useState(false);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [postsQuery, setPostsQuery] = useState<PostQuery[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [recentSnapshot, setRecentSnapshot] = useState<
    QuerySnapshot<DocumentData>
  >({} as QuerySnapshot<DocumentData>);
  const loadMorePosts = async () => {
    setShowLoading(true);
    setShowLoadMoreButton(false);
    const lastVisible = recentSnapshot.docs[recentSnapshot.docs.length - 1];
    const postsQueryDocs = query(
      collection(getFirestore(), "posts"),
      orderBy("timestamp", "desc"),
      where("postedBy", "in", [...user.following]),
      startAfter(lastVisible),
      limit(8)
    );
    const postQueryDocs = await getDocs(postsQueryDocs);
    const postsQueryData = await Promise.all(
      postQueryDocs.docs
        .map((doc) => doc.data() as Post)
        .map(async (post) => {
          const userDoc = doc(getFirestore(), `users/${post.postedBy}`);
          const userData = (await getDoc(userDoc)).data() as User;
          return {
            post: post,
            postUser: userData,
          } as PostQuery;
        })
    );
    if (postsQueryData.length === 0) {
      setShowNoMorePostsText(true);
    } else if (postsQueryData.length < 8) {
      setPostsQuery([...postsQuery, ...postsQueryData]);
      setShowNoMorePostsText(true);
    } else {
      setPostsQuery([...postsQuery, ...postsQueryData]);
      setShowLoadMoreButton(true);
    }
    setRecentSnapshot(postQueryDocs);
    setShowLoading(false);
  };
  useEffect(() => {
    const loadInitialPosts = async () => {
      const postsQueryDocs = query(
        collection(getFirestore(), "posts"),
        where("postedBy", "in", [...user.following]),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const postQueryDocs = await getDocs(postsQueryDocs);
      const postsQueryData = await Promise.all(
        postQueryDocs.docs
          .map((doc) => doc.data() as Post)
          .map(async (post) => {
            const userDoc = doc(getFirestore(), `users/${post.postedBy}`);
            const userData = (await getDoc(userDoc)).data() as User;
            return {
              post: post,
              postUser: userData,
            } as PostQuery;
          })
      );
      if (postsQueryData.length === 0) {
        setShowSuggestionsList(true);
      } else if (postsQueryData.length < 5) {
        setShowNoMorePostsText(true);
      } else {
        setShowLoadMoreButton(true);
      }
      setRecentSnapshot(postQueryDocs);
      setPostsQuery(postsQueryData);
    };
    loadInitialPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);

    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  return (
    <HomeContainer>
      {showSuggestionsList ? (
        <SuggestionsList />
      ) : (
        <React.Fragment>
          <PostFeedWrapper>
            {postsQuery.map((postQuery) => (
              <StandardPost
                post={postQuery.post}
                postUser={postQuery.postUser}
                isOnHomePosts={true}
                key={postQuery.post.id}
              />
            ))}
            {showLoadMoreButton === true ? (
              <Button onClick={loadMorePosts}>Load More</Button>
            ) : null}
            {showLoading === true ? <Loader /> : null}
            {showNoMorePostsText === true ? (
              <PostText>No more posts to show.</PostText>
            ) : null}
          </PostFeedWrapper>
          {width >= 1024 && postsQuery.length !== 0 ? <Suggestions /> : null}
        </React.Fragment>
      )}
    </HomeContainer>
  );
};
const HomeContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.primary.main};
  display: flex;
  min-height: 100vh;
  width: 100%;
  @media only screen and (min-width: 1024px) {
    gap: 0.5rem;
    padding: 3rem;
    justify-content: center;
    gap: 2rem;
  }
`;
const PostFeedWrapper = styled.div`
  display: grid;
  gap: 2rem;
  justify-items: center;
  padding: 0.5rem 0rem 15rem 0rem;
  @media only screen and (min-width: 768px) {
    padding: 4rem 0rem 15rem 0rem;
  }
  @media only screen and (min-width: 1024px) {
    padding: 0rem;
    max-width: 614px;
  }
`;
const TestingContainer = styled.div`
  position: sticky;
  top: 55px;
  height: 80vh;
`;
export default Home;
