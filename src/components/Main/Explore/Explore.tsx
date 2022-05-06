import React, { useState, useEffect } from "react";
import Post from "../../utils/PostInterface";
import {
  query,
  collection,
  getFirestore,
  where,
  QuerySnapshot,
  DocumentData,
  limit,
  getDocs,
  orderBy,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import styled from "styled-components";
import {
  selectExplorePostsAmount,
  setExplorePostsAmount,
} from "../../../features/explorePosts/explorePostsSlice";
import { BasicText } from "../../utils/Texts";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { selectUser } from "../../../features/user/userSlice";
import ReturnBack from "../../utils/ReturnBack";
import StandardPost from "../Posts/StandardPost";
import PostPreview from "../Posts/PostPreview";
import Button from "../../utils/Button";
import Loader from "../../utils/Loader";

const Explore = () => {
  const [explorePosts, setExplorePosts] = useState<Post[]>([]);
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);
  const [postToShow, setPostToShow] = useState<Post | null>(null);
  const explorePostsAmount = useAppSelector(selectExplorePostsAmount);
  const [showNoMorePostsText, setShowNoMorePostsText] = useState(false);
  const dispatch = useAppDispatch();
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [recentSnapshot, setRecentSnapshot] = useState<
    QuerySnapshot<DocumentData>
  >({} as QuerySnapshot<DocumentData>);
  const removePost = (postID: string) => {
    console.log("REMOVING POST", postID);
    const filteredPosts = explorePosts.filter((post) => post.id !== postID);
    setExplorePosts(filteredPosts);
    dispatch(setExplorePostsAmount(explorePostsAmount - 1));
  };
  const changePostToShow = (post: Post | null) => {
    setPostToShow(post);
  };
  const loadMorePosts = async () => {
    setShowLoading(true);
    setShowLoadMoreButton(false);
    const lastVisible = recentSnapshot.docs[recentSnapshot.docs.length - 1];
    const postsQuery = query(
      collection(getFirestore(), "posts"),
      orderBy("timestamp", "desc"),
      where("postedBy", "in", [...users.map((user) => user.id)]),
      startAfter(lastVisible),
      limit(10)
    );
    const postQueryDocs = await getDocs(postsQuery);
    const postsQueryData = postQueryDocs.docs.map((doc) => doc.data() as Post);
    dispatch(setExplorePostsAmount(explorePostsAmount + 10));
    if (postsQueryData.length === 0) {
      setShowNoMorePostsText(true);
    } else if (postsQueryData.length < 10) {
      setExplorePosts([...explorePosts, ...postsQueryData]);
      setShowNoMorePostsText(true);
    } else {
      setExplorePosts([...explorePosts, ...postsQueryData]);
      setShowLoadMoreButton(true);
    }
    setRecentSnapshot(postQueryDocs);
    setShowLoading(false);
  };
  useEffect(() => {
    const loadInitialPosts = async () => {
      const postsQuery = query(
        collection(getFirestore(), "posts"),
        where("postedBy", "in", [...users.map((user) => user.id)]),
        orderBy("timestamp", "desc"),
        limit(explorePostsAmount)
      );
      const postQueryDocs = await getDocs(postsQuery);
      const postsQueryData = postQueryDocs.docs.map(
        (doc) => doc.data() as Post
      );

      if (postsQueryData.length < explorePostsAmount) {
        setShowNoMorePostsText(true);
      } else {
        setShowLoadMoreButton(true);
      }
      setRecentSnapshot(postQueryDocs);
      setExplorePosts(postsQueryData);
    };
    loadInitialPosts();
  }, []);
  useEffect(() => {
    const updatePosts = async () => {
      const postsQuery = query(
        collection(getFirestore(), "posts"),
        orderBy("timestamp", "desc")
      );

      return onSnapshot(postsQuery, (snapshot) => {
        setExplorePosts(
          [...snapshot.docs.map((doc) => doc.data() as Post)].filter((post) =>
            [...explorePosts]
              .map((explorePost) => explorePost.id)
              .includes(post.id)
          )
        );
      });
    };
    if (explorePosts.length === 0) return;
    const unsubscribe = updatePosts();
    return () => {
      unsubscribe.then((unsubscribe) => unsubscribe());
    };
  }, [explorePosts.length]);
  return (
    <ExploreWrapper>
      <PostsContainer data-testid="Posts Container">
        {explorePosts.map((post) => (
          <PostPreview
            post={post}
            changePostToShow={changePostToShow}
            key={post.id}
          />
        ))}
      </PostsContainer>
      {showLoadMoreButton === true ? (
        <Button onClick={loadMorePosts}>Load More</Button>
      ) : null}
      {showLoading === true ? <Loader /> : null}
      {showNoMorePostsText === true ? (
        <BasicText fontWeight="400" fontSize="1.4rem" textAlign="center">
          ~No More Posts~
        </BasicText>
      ) : null}
      {postToShow !== null && (
        <SelectedPostWrapper key={postToShow.id}>
          <ReturnBack name="Explore" onClick={() => changePostToShow(null)} />
          <StandardPost
            post={postToShow}
            postUser={
              postToShow.postedBy === user.id
                ? user
                : users.filter((user) => user.id === postToShow.postedBy)[0]
            }
            isOnHomePosts={false}
            changePostToShow={changePostToShow}
            removePost={removePost}
          />
        </SelectedPostWrapper>
      )}
    </ExploreWrapper>
  );
};
const ExploreWrapper = styled.div`
  display: grid;
  gap: 2rem;
  max-width: 985px;
  margin: 0 auto;
  padding: 1rem 0.5rem 7rem 0.5rem;
  justify-items: center;
`;
const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(97% / 3));
  width: 100%;
  gap: 0.4rem;
  @media only screen and (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, calc(92% / 3));
    gap: 2.8rem;
  }
`;

const SelectedPostWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: scroll;
  z-index: 35;
`;

export default Explore;
