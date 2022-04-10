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
  useEffect(() => {
    const loadPosts = async () => {
      const postsQueryDocs = query(
        collection(getFirestore(), "posts"),
        limit(10)
      );
      const postsQueryData = await Promise.all(
        (
          await getDocs(postsQueryDocs)
        ).docs
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
      if (postsQueryData.length < 10) {
        setShowNoMorePostsText(true);
      } else {
        setShowLoadMoreButton(true);
      }
      setPostsQuery(postsQueryData);
    };
    loadPosts();
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
      {showLoadMoreButton === true ? <Button>Load More</Button> : null}
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
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.neutral};
  @media only screen and (min-width: 768px) {
    padding: 4rem 0rem 15rem 0rem;
  }
`;
export default Home;
