import ModalWrapper from "../utils/ModalWrapper";
import styled from "styled-components";
import Post from "../utils/PostInterface";
import { selectUser, User } from "../../features/user/userSlice";
import CircularUserImage from "../utils/CircularUserImage";
import { PostTextBold, PostGreyText } from "../utils/Texts";
import FlexContainer from "../utils/FlexContainer";
import {
  BsThreeDots,
  BsBookmark,
  BsBookmarkFill,
  BsSuitHeart,
  BsSuitHeartFill,
} from "react-icons/bs";
import HorizontalLine from "../utils/HorizontalLine";
import React from "react";
import Comments from "./Comments";
import Comment from "./Comment";
import { formatDistanceToNow } from "date-fns";
import {
  userHasSavedPost,
  userHasLikedPost,
  clickLikeIcon,
  clickBookmarkIcon,
  checkEquality,
} from "../utils/utilityFunctions";
import AddComment from "./AddComment";
import { useAppSelector } from "../../app/hooks";
interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const LargeModal = React.memo(
  ({ post, postUser, changeModalStatus }: IProps) => {
    console.log("large modal");
    const user = useAppSelector(selectUser, checkEquality);
    return (
      <ModalWrapper>
        <LargeModalWrapper>
          <LargePostPicture src={post.imgSrc} alt="photo of the post" />
          <FlexContainer direction="column">
            <FlexContainer direction="column" gap="1rem">
              <FlexContainer
                direction="row"
                justifyContent="space-between"
                padding="1rem 1rem"
              >
                <FlexContainer direction="row" gap="0.4rem" alignItems="center">
                  <CircularUserImage
                    src={postUser.profilePicture}
                    alt={"avatar of profile user"}
                  />
                  <PostTextBold>{postUser.username}</PostTextBold>
                </FlexContainer>
                <BsThreeDots />
              </FlexContainer>
              <HorizontalLine />
            </FlexContainer>
            <FlexContainer
              direction="column"
              overflowY="scroll"
              height="0vh"
              padding="0.5rem 1rem"
              flexGrow="1"
            >
              <Comment
                content={post.caption}
                timestamp={post.timestamp}
                user={postUser}
              />
              <Comments post={post} postUser={postUser} />
            </FlexContainer>
            <FlexContainer
              direction="column"
              padding="1rem 1.6rem"
              gap="0.4rem"
            >
              <FlexContainer
                direction="row"
                justifyContent="space-between"
                margin="0rem 0rem 1.2rem 0rem"
              >
                {userHasLikedPost(user, post) ? (
                  <BsSuitHeartFill
                    style={{ color: "red" }}
                    title="Unlike this post"
                    onClick={() => clickLikeIcon(user, post)}
                  />
                ) : (
                  <BsSuitHeart
                    title="Like this post"
                    onClick={() => clickLikeIcon(user, post)}
                  />
                )}{" "}
                {userHasSavedPost(user, post) ? (
                  <BsBookmarkFill
                    title={`Unsave this post`}
                    onClick={() => clickBookmarkIcon(user, post)}
                  />
                ) : (
                  <BsBookmark
                    title={"Save this post"}
                    onClick={() => clickBookmarkIcon(user, post)}
                  />
                )}{" "}
              </FlexContainer>
              <PostTextBold>
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </PostTextBold>
              <PostGreyText>{`${formatDistanceToNow(
                post.timestamp.toDate()
              )} ago`}</PostGreyText>
            </FlexContainer>
            <AddComment post={post} postUser={postUser} />
          </FlexContainer>
        </LargeModalWrapper>
      </ModalWrapper>
    );
  },
  (nextProps, prevProps) => nextProps.post === prevProps.post
);
const LargeModalWrapper = styled.div`
  display: grid;
  width: min(95%, 900px);
  max-height: 800px;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: fixed;
  grid-template-columns: 5fr 4fr;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;
const LargePostPicture = styled.img`
  width: 100%;
  aspect-ratio: 1/1.2;
`;
export default LargeModal;
