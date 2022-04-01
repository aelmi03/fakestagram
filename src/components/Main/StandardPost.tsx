import styled, { css } from "styled-components";

import {
  BsThreeDots,
  BsChatDots,
  BsBookmark,
  BsBookmarkFill,
  BsSuitHeart,
  BsSuitHeartFill,
} from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import FlexContainer from "../utils/FlexContainer";
import Post from "../utils/PostInterface";
import { selectUser, User } from "../../features/user/userSlice";
import {
  PostGreyText,
  PostText,
  PostTextBold,
  ClickablePostGreyText,
} from "../utils/Texts";
import React, { useEffect, useState } from "react";
import PostModal from "./PostModal";
import AddComment from "./AddComment";
import { useAppSelector } from "../../app/hooks";
import { doc, getFirestore, onSnapshot, Timestamp } from "firebase/firestore";
import {
  checkEquality,
  clickBookmarkIcon,
  clickLikeIcon,
  userHasLikedPost,
  userHasSavedPost,
  deletePost,
} from "../utils/utilityFunctions";
import CircularUserImage from "../utils/CircularUserImage";
interface IProps {
  post: Post;
  postUser: User;
  isOnHomePosts: boolean;
  changePostToShow?: (post: Post | null) => void;
}
const StandardPost = React.memo(
  ({ post, postUser, isOnHomePosts, changePostToShow }: IProps) => {
    console.log("STANDARD POST");
    console.log(changePostToShow);
    const user = useAppSelector(selectUser, checkEquality);
    const [postInfo, setPostInfo] = useState<Post>(post);
    const [showPostModal, setShowPostModal] = useState(isOnHomePosts);
    const [width, setWidth] = useState(window.innerWidth);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const changeModalStatus = () => {
      setShowPostModal((prevBoolean) => !prevBoolean);
    };

    useEffect(() => {
      let hasFetched = false;
      const postDoc = doc(getFirestore(), `posts/${postInfo.id}`);
      const unsubscribe = onSnapshot(postDoc, (snapshot) => {
        if (!hasFetched) {
          hasFetched = true;
          return;
        }
        if (!snapshot.exists()) {
          if (changePostToShow) {
            changePostToShow(null);
          }
        }
        setPostInfo(snapshot.data() as Post);
      });
      return () => {
        unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postInfo, user]);
    if (width >= 768 && showPostModal === false && isOnHomePosts === false) {
      setShowPostModal(true);
    }
    useEffect(() => {
      const handleResizeWindow = () => setWidth(window.innerWidth);

      // subscribe to window resize event "onComponentDidMount"
      window.addEventListener("resize", handleResizeWindow);
      return () => {
        // unsubscribe "onComponentDestroy"
        window.removeEventListener("resize", handleResizeWindow);
      };
    }, []);
    return (
      <PostWrapper
        isOnHomePosts={isOnHomePosts}
        onClick={() => {
          if (showDeleteButton === true) {
            setShowDeleteButton(false);
          }
        }}
      >
        <FlexContainer direction="column" gap="1rem">
          <FlexContainer
            direction="row"
            padding="1.4rem 1.4rem 0rem 1.4rem"
            justifyContent="space-between"
          >
            <FlexContainer
              direction="row"
              gap="0.8rem"
              width="max-content"
              alignItems="center"
            >
              <CircularUserImage src={postUser.profilePicture} />
              <PostTextBold>{postUser.username}</PostTextBold>
            </FlexContainer>
            {user.id === postUser.id ? (
              <FlexContainer
                direction="row"
                width={"max-content"}
                position="relative"
              >
                <BsThreeDots onClick={() => setShowDeleteButton(true)} />
                <DeletePostButton
                  show={showDeleteButton}
                  onClick={() => {
                    deletePost(post);
                  }}
                >
                  Delete
                </DeletePostButton>
              </FlexContainer>
            ) : null}
          </FlexContainer>
          <PostImage src={postInfo.imgSrc} />
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
                {userHasLikedPost(user, postInfo) ? (
                  <BsSuitHeartFill
                    style={{ color: "red" }}
                    title="Unlike this post"
                    onClick={() => clickLikeIcon(user, postInfo)}
                  />
                ) : (
                  <BsSuitHeart
                    title="Like this post"
                    onClick={() => clickLikeIcon(user, postInfo)}
                  />
                )}
                <BsChatDots
                  onClick={changeModalStatus}
                  title={"View comments"}
                />
              </FlexContainer>
              {userHasSavedPost(user, postInfo) ? (
                <BsBookmarkFill
                  title={`Unsave this post`}
                  onClick={() => clickBookmarkIcon(user, postInfo)}
                />
              ) : (
                <BsBookmark
                  title={"Save this post"}
                  onClick={() => clickBookmarkIcon(user, postInfo)}
                />
              )}
            </FlexContainer>
            <FlexContainer direction="row" gap="0.6rem">
              <PostTextBold>
                {postInfo.likes.length}{" "}
                {postInfo.likes.length === 1 ? "like" : "likes"}
              </PostTextBold>
            </FlexContainer>
            <PostTextBold>
              {postUser.username}
              <PostText>&nbsp;&nbsp;{post.caption}</PostText>
            </PostTextBold>
            <ClickablePostGreyText onClick={changeModalStatus}>
              View all {postInfo.comments.length}{" "}
              {postInfo.comments.length > 1 ? "comments" : "comment"}
            </ClickablePostGreyText>
            <PostGreyText>
              {`${formatDistanceToNow(
                (postInfo.timestamp as Timestamp).toDate()
              )} ago`}
            </PostGreyText>
          </FlexContainer>
          <AddComment post={postInfo} postUser={postUser} />
        </FlexContainer>
        {showPostModal === true && (
          <PostModal
            postUser={postUser}
            post={postInfo}
            changeModalStatus={changeModalStatus}
            width={width}
            changePostToShow={changePostToShow}
          />
        )}
      </PostWrapper>
    );
  },
  () => true
);
const PostWrapper = styled.div<{ isOnHomePosts: boolean }>`
  width: min(100%, 768px);
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
  ${({ isOnHomePosts }) =>
    isOnHomePosts === false &&
    css`
      @media only screen and (min-width: 768px) {
        > :nth-child(1) {
          display: none;
        }
      }
    `}
`;
const DeletePostButton = styled.button<{ show: boolean }>`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.lightRed};
  font-size: 1.4rem;
  font-family: ${({ theme }) => theme.primaryFont};
  padding: 1.3rem 2rem;
  position: absolute;
  top: 8px;
  right: 30px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  ${({ show }) =>
    show === false &&
    css`
      display: none;
    `}
`;
const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1.1;
`;

export default StandardPost;
