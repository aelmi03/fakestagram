import styled from "styled-components";
import { BsThreeDots, BsBookmark, BsChatDots } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { VscHeart } from "react-icons/vsc";
import FlexContainer from "../utils/FlexContainer";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import {
  PostCommentText,
  PostGreyText,
  PostText,
  PostTextBold,
  ClickablePostGreyText,
} from "../utils/Texts";
import React, { useState } from "react";
import PostModal from "./PostModal";
import AddComment from "./AddComment";
interface IProps {
  post: Post;
  postUser: User;
}
const StandardPost = ({ post, postUser }: IProps) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const changeModalStatus = () => {
    setShowPostModal((prevBoolean) => !prevBoolean);
  };
  return (
    <PostWrapper>
      <FlexContainer
        direction="row"
        padding="1.4rem 1.4rem 0rem 1.4rem"
        justifyContent="space-between"
      >
        <FlexContainer direction="row" gap="0.8rem" width="max-content">
          <PostUserImage src={postUser.profilePicture} />
          <PostTextBold>{postUser.username}</PostTextBold>
        </FlexContainer>
        <BsThreeDots />
      </FlexContainer>
      <PostImage src={post.imgSrc} />
      <FlexContainer
        direction="column"
        gap="0.5rem"
        padding="1.4rem"
        justifyContent="start"
      >
        <FlexContainer
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <FlexContainer
            direction="row"
            gap="1.5rem"
            width="max-content"
            alignContent="center"
          >
            <VscHeart />
            <BsChatDots onClick={changeModalStatus} />
          </FlexContainer>
          <BsBookmark />
        </FlexContainer>
        <FlexContainer direction="row" gap="0.6rem">
          <PostTextBold>
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </PostTextBold>
        </FlexContainer>
        <PostTextBold>
          {postUser.username}
          <PostText>&nbsp;&nbsp;{post.caption}</PostText>
        </PostTextBold>

        <ClickablePostGreyText onClick={changeModalStatus}>
          View all {post.comments.length}{" "}
          {post.comments.length > 1 ? "comments" : "comment"}
        </ClickablePostGreyText>
        <PostGreyText>
          {`${formatDistanceToNow(post.timestamp.toDate())} ago`}
        </PostGreyText>
      </FlexContainer>
      <AddComment />
      {showPostModal === true && (
        <PostModal
          postUser={postUser}
          post={post}
          changeModalStatus={changeModalStatus}
        />
      )}
    </PostWrapper>
  );
};
const PostWrapper = styled.div`
  width: min(100%, 600px);
  margin-top: 4rem;
  display: grid;
  gap: 1rem;
  margin-bottom: 5.1rem;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  svg {
    height: 28px;
    width: 28px;
    cursor: pointer;
  }
`;

const PostUserImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1.1;
`;

export default StandardPost;
