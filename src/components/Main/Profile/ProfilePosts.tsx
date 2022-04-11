import styled, { css } from "styled-components";
import { BsGrid3X3 } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa";
import Post from "../../utils/PostInterface";
import React, { useEffect, useState } from "react";
import { selectUser, User } from "../../../features/user/userSlice";
import { BsFillChatFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";

import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import FlexContainer from "../../utils/FlexContainer";
import { Unsubscribe } from "firebase/auth";
import { useAppSelector } from "../../../app/hooks";
import { checkEquality } from "../../utils/utilityFunctions";
interface IProps {
  profileUser: User;
  changePostToShow: (post: Post) => void;
}
const ProfilePosts = React.memo(
  ({ profileUser, changePostToShow }: IProps) => {
    console.log("profileUser :))", profileUser);
    const user = useAppSelector(selectUser, checkEquality);
    const [typeOfPosts, setTypeOfPosts] = useState("Own Posts");
    const [profilePosts, setProfilePosts] = useState<Post[]>([]);
    useEffect(() => {
      if (profileUser.id === undefined) return;
      console.log("PROFILE POSTS USE EFFECT");
      const getProfileUserPosts = async () => {
        const profileUserPostsQuery = query(
          collection(getFirestore(), "posts"),
          where("postedBy", "==", `${profileUser.id}`),
          orderBy("timestamp", "desc")
        );
        return onSnapshot(profileUserPostsQuery, (snapshot) => {
          const posts = snapshot.docs.map((doc) => doc.data() as Post);
          setProfilePosts(posts);
        });
      };
      const getSavedPosts = async () => {
        const savedPostsQuery = query(
          collection(getFirestore(), "posts"),
          where("id", "in", user.savedPosts),
          orderBy("timestamp", "desc")
        );
        return onSnapshot(savedPostsQuery, (snapshot) => {
          const posts = snapshot.docs.map((doc) => doc.data() as Post);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeOfPosts, profileUser.id, user.savedPosts]);
    return (
      <ProfilePostsWrapper>
        <FlexContainer direction="row" justifyContent="space-evenly">
          <InfoContainer
            onClick={() => setTypeOfPosts("Own Posts")}
            highlight={typeOfPosts === "Own Posts"}
          >
            <BsGrid3X3 /> <InfoText>POSTS</InfoText>
          </InfoContainer>
          {user.id === profileUser.id ? (
            <InfoContainer
              onClick={() => setTypeOfPosts("Saved Posts")}
              highlight={typeOfPosts === "Saved Posts"}
            >
              <FaRegBookmark /> <InfoText>SAVED POSTS</InfoText>
            </InfoContainer>
          ) : null}
        </FlexContainer>
        <PostsContainer data-testid="Posts Container">
          {profilePosts.map((post) => (
            <ProfilePost
              key={post.id}
              onClick={() => changePostToShow(post)}
              data-testid={`${post.id}`}
            >
              <ProfilePostImage src={post.imgSrc} alt="profile" />
              <PostInformation>
                <FlexContainer direction="row" gap="0.7rem" alignItems="center">
                  <AiFillHeart />
                  <PostInformationText data-testid="likes">
                    {post.likes.length}
                  </PostInformationText>
                </FlexContainer>
                <FlexContainer direction="row" gap="0.7rem" alignItems="center">
                  <BsFillChatFill />
                  <PostInformationText data-testid="comments">
                    {post.comments.length}
                  </PostInformationText>
                </FlexContainer>
              </PostInformation>
            </ProfilePost>
          ))}
        </PostsContainer>
      </ProfilePostsWrapper>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.profileUser.id !== nextProps.profileUser.id) {
      console.log("HEHEHEHHEHEHEHE");
      return false;
    }
    return !checkEquality(prevProps.profileUser, nextProps.profileUser);
  }
);

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
const PostInformationText = styled.h4`
  color: ${({ theme }) => theme.palette.common.white};
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.2rem;
  font-weight: bold;
  @media only screen and (min-width: 540px) {
    font-size: 1.75rem;
  }
`;
const ProfilePostImage = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
`;
const ProfilePost = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
`;
const PostInformation = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  &:hover {
    opacity: 1;
  }
  svg {
    color: ${({ theme }) => theme.palette.common.white};
    height: 15px;
    width: 15px;
    @media only screen and (min-width: 540px) {
      height: 25px;
      width: 25px;
    }
  }
  div {
    width: max-content;
  }
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
