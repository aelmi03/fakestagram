import styled from "styled-components";
import FlexContainer from "../../utils/FlexContainer";
import { BsGrid3X3 } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa";
import Post from "../../utils/PostInterface";
import React, { useEffect, useState } from "react";
import { User } from "../../../features/user/userSlice";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
interface IProps {
  profileUser: User;
}
const ProfilePosts = ({ profileUser }: IProps) => {
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
    let unsubscribeFunction: Unsubscribe;
    if (typeOfPosts === "Own Posts") {
      getProfileUserPosts().then((unsubscribe) => {
        unsubscribeFunction = unsubscribe;
      });
    }
    return () => {
      unsubscribeFunction();
    };
  }, [typeOfPosts, profileUser.id]);
  return (
    <ProfilePostsWrapper>
      <FlexContainer direction="row" justifyContent="space-evenly">
        <InfoContainer>
          <BsGrid3X3 /> <InfoText>POSTS</InfoText>
        </InfoContainer>
        <InfoContainer>
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
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  margin-bottom: 5rem;
`;
const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(97% / 3));
  width: 100%;
  gap: 0.4rem;
  @media only screen and (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, calc(94% / 3));
    gap: 2.8rem;
  }
`;
const InfoText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.3rem;
`;
const ProfilePost = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
`;
const InfoContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  top: -1px;
  color: ${({ theme }) => theme.palette.darkGrey};
  :nth-child(1) {
    border-top: 1px solid ${({ theme }) => theme.palette.common.black};
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`;
export default ProfilePosts;
