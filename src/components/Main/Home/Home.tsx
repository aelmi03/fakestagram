import styled from "styled-components";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import { useState, useEffect } from "react";
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
} from "firebase/firestore";
import StandardPost from "../Posts/StandardPost";
import Button from "../../utils/Button";
import Loader from "../../utils/Loader";
import { PostText } from "../../utils/Texts";
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
  const [recentSnapshot, setRecentSnapshot] = useState<
    QuerySnapshot<DocumentData>
  >({} as QuerySnapshot<DocumentData>);
  const loadMorePosts = async () => {
    setShowLoading(true);
    setShowLoadMoreButton(false);
    const lastVisible = recentSnapshot.docs[recentSnapshot.docs.length - 1];
    const postsQueryDocs = query(
      collection(getFirestore(), "posts"),
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
        limit(1)
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

      if (postsQueryData.length < 1) {
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
  return (
    <HomeWrapper>
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
    </HomeWrapper>
  );
};
const HomeWrapper = styled.div`
  display: grid;
  gap: 2rem;
  justify-items: center;
  padding: 0.5rem 0rem 15rem 0rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
  @media only screen and (min-width: 768px) {
    padding: 4rem 0rem 15rem 0rem;
  }
`;
export default Home;
