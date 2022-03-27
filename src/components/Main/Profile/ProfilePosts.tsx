import styled, { css } from "styled-components";
import { BsGrid3X3 } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa";
import Post from "../../utils/PostInterface";
import React, { useEffect, useState } from "react";
import { selectUser, User } from "../../../features/user/userSlice";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import FlexContainer from "../../utils/FlexContainer";
import { Unsubscribe } from "firebase/auth";
import { useAppSelector } from "../../../app/hooks";
interface IProps {
  profileUser: User;
}
const ProfilePosts = ({ profileUser }: IProps) => {
  const user = useAppSelector(selectUser);
  const [typeOfPosts, setTypeOfPosts] = useState("Own Posts");
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  useEffect(() => {
    const getProfileUserPosts = async () => {
      const profileUserPostsQuery = query(
        collection(getFirestore(), "posts"),
        where("postedBy", "==", `${profileUser.id}`)
      );
      return onSnapshot(profileUserPostsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => doc.data() as Post);
        setProfilePosts(posts);
      });
    };
    const getSavedPosts = async () => {
      const savedPostsQuery = query(collection(getFirestore(), "posts"));
      return onSnapshot(savedPostsQuery, (snapshot) => {
        const posts = snapshot.docs
          .map((doc) => doc.data() as Post)
          .filter((post) => user.savedPosts.includes(post.id));
        setProfilePosts(posts);
      });
    };
    let unsubscribeFunction: Unsubscribe;
    if (typeOfPosts === "Own Posts") {
      getProfileUserPosts().then((unsubscribe) => {
        unsubscribeFunction = unsubscribe;
      });
    } else {
      getSavedPosts().then((unsubscribe) => {
        unsubscribeFunction = unsubscribe;
      });
    }
    return () => {
      unsubscribeFunction();
    };
  }, [typeOfPosts, profileUser.id, user]);
  return (
    <ProfilePostsWrapper>
      <FlexContainer direction="row" justifyContent="space-evenly">
        <InfoContainer
          onClick={() => setTypeOfPosts("Own Posts")}
          highlight={typeOfPosts === "Own Posts"}
        >
          <BsGrid3X3 /> <InfoText>POSTS</InfoText>
        </InfoContainer>
        <InfoContainer
          onClick={() => setTypeOfPosts("Saved Posts")}
          highlight={typeOfPosts === "Saved Posts"}
        >
          <FaRegBookmark /> <InfoText>SAVED POSTS</InfoText>
        </InfoContainer>
      </FlexContainer>
      <PostsContainer>
        {profilePosts.map((post) => (
          <ProfilePost src={post.imgSrc} alt="profile" />
        ))}
      </PostsContainer>
    </ProfilePostsWrapper>
  );
};
const ProfilePostsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  margin-bottom: 5rem;
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

const InfoText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.3rem;
`;
const ProfilePost = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
`;
const InfoContainer = styled.div<{ highlight: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  top: -1px;
  color: ${({ theme }) => theme.palette.darkGrey};
  ${({ highlight }) =>
    highlight === true &&
    css`
      border-top: 1px solid ${({ theme }) => theme.palette.common.black};
      color: ${({ theme }) => theme.palette.primary.contrastText};
    `}
`;
export default ProfilePosts;
