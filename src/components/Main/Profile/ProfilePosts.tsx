import styled from "styled-components";
import FlexContainer from "../../utils/FlexContainer";
import { BsGrid3X3 } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa";
import Post from "../../utils/PostInterface";
import React, { useEffect, useState } from "react";
import { User } from "../../../features/user/userSlice";
interface IProps {
  profileUser: User;
}
const ProfilePosts = ({ profileUser }: IProps) => {
  console.log(profileUser, "Profile Posts :)");
  const [typeOfPosts, setTypeOfPosts] = useState("Own Posts");
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  useEffect(() => {
    if (typeOfPosts === "Own Posts") {
    }
  }, [typeOfPosts]);
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
      <PostsContainer>{}</PostsContainer>
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
  grid-template-columns: repeat(auto-fit, 30.5%);
  width: 100%;
  gap: 0.6rem;
  justify-content: center;
  @media only screen and (min-width: 768px) {
    gap: 2.8rem;
  }
`;
const InfoText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.3rem;
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
