import styled from "styled-components";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
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
  Query,
} from "firebase/firestore";
import StandardPost from "../Posts/StandardPost";
import Button from "../../utils/Button";
import Loader from "../../utils/Loader";
import { PostText } from "../../utils/Texts";
import Suggestions from "./Suggestions";
import SuggestionsList from "./SuggestionsList";
import {
  selectHomePosts,
  setHomePosts,
} from "../../../features/homePosts/homePostsSlice";
import Post from "../../utils/PostInterface";
import { selectAllUsers } from "../../../features/users/usersSlice";

const Home = () => {
  const user = useAppSelector(selectUser);
  const homePostsData = useAppSelector(selectHomePosts);
  const users = useAppSelector(selectAllUsers);
  const [showNoMorePostsText, setShowNoMorePostsText] = useState(false);
  const dispatch = useAppDispatch();
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [recentSnapshot, setRecentSnapshot] = useState<
    QuerySnapshot<DocumentData>
  >({} as QuerySnapshot<DocumentData>);
  const loadMorePosts = async () => {
    setShowLoading(true);
    setShowLoadMoreButton(false);
    const lastVisible = recentSnapshot.docs[recentSnapshot.docs.length - 1];
    const postsQuery = query(
      collection(getFirestore(), "posts"),
      orderBy("timestamp", "desc"),
      where("postedBy", "in", [...user.following]),
      startAfter(lastVisible),
      limit(8)
    );
    const postQueryDocs = await getDocs(postsQuery);
    const postsQueryData = postQueryDocs.docs.map((doc) => doc.data() as Post);

    if (postsQueryData.length === 0) {
      setShowNoMorePostsText(true);
    } else if (postsQueryData.length < 8) {
      setPosts([...posts, ...postsQueryData]);
      setShowNoMorePostsText(true);
    } else {
      setPosts([...posts, ...postsQueryData]);
      setShowLoadMoreButton(true);
    }
    setRecentSnapshot(postQueryDocs);
    setShowLoading(false);
  };
  const getNewPosts = async () => {
    const postsQuery = query(
      collection(getFirestore(), "posts"),
      where("postedBy", "in", [...user.following]),
      orderBy("timestamp", "desc"),
      limit(8)
    );
    const postQueryDocs = await getDocs(postsQuery);
    const postsQueryData = postQueryDocs.docs.map((doc) => doc.data() as Post);

    if (postsQueryData.length === 0) {
      setShowSuggestionsList(true);
    } else if (postsQueryData.length < 8) {
      setShowNoMorePostsText(true);
    } else {
      setShowLoadMoreButton(true);
    }
    setRecentSnapshot(postQueryDocs);
    setPosts(postsQueryData);
  };
  const getHomePosts = async () => {
    const homePosts = homePostsData.posts;
    if (homePosts.length === 0) {
      setShowSuggestionsList(true);
    } else if (homePosts.length < homePostsData.postsRequested) {
      setShowNoMorePostsText(true);
    } else {
      setShowLoadMoreButton(true);
    }
    setRecentSnapshot(homePostsData.recentSnapshot!);
    setPosts(homePosts);
  };
  useEffect(() => {
    const loadInitialPosts = async () => {
      if (homePostsData.recentSnapshot) {
        console.log("GETTING HOME POSTS");
        getHomePosts();
      } else {
        console.log("GETTING NEW POSTS");

        getNewPosts();
      }
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

  useEffect(() => {
    if (!recentSnapshot) {
      return;
    } else {
      dispatch(
        setHomePosts({
          posts,
          recentSnapshot,
          postsRequested: homePostsData.postsRequested + 8,
        })
      );
    }
  }, [recentSnapshot, posts]);
  return (
    <HomeContainer showSuggestionsList={showSuggestionsList}>
      {showSuggestionsList ? (
        <SuggestionsList />
      ) : (
        <React.Fragment>
          <PostFeedWrapper data-testid="PostFeed Wrapper">
            {posts.map((post) => (
              <StandardPost
                post={post}
                postUser={users.filter((user) => user.id === post.postedBy)[0]}
                isOnHomePosts={true}
                key={post.id}
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
          {width >= 1024 && posts.length !== 0 ? <Suggestions /> : null}
        </React.Fragment>
      )}
    </HomeContainer>
  );
};
const HomeContainer = styled.div<{ showSuggestionsList: boolean }>`
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

export default Home;
