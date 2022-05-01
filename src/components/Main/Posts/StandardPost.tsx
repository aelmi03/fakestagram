import styled, { css } from "styled-components";

import { BsThreeDots } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import FlexContainer from "../../utils/FlexContainer";
import Post from "../../utils/PostInterface";
import { selectUser, User } from "../../../features/user/userSlice";
import {
  PostGreyText,
  PostText,
  PostTextBold,
  ClickablePostGreyText,
} from "../../utils/Texts";
import React, { useEffect, useState } from "react";
import PostModal from "./PostModal";
import AddComment from "./AddComment";
import { useAppSelector } from "../../../app/hooks";
import { doc, getFirestore, onSnapshot, Timestamp } from "firebase/firestore";
import { checkEquality, deletePost } from "../../utils/utilityFunctions";
import DeletePostButton from "../../utils/DeletePostButton";
import CircularUserImage from "../../utils/CircularUserImage";
import PostIcons from "./PostIcons";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
interface IProps {
  post: Post;
  postUser: User;
  isOnHomePosts: boolean;
  changePostToShow?: (post: Post | null) => void;
}
const StandardPost = React.memo(
  ({ post, postUser, isOnHomePosts, changePostToShow }: IProps) => {
    console.log("STANDARD POST");
    const user = useAppSelector(selectUser, checkEquality);
    const navigate = useNavigate();
    const [postInfo, setPostInfo] = useState<Post>(post);
    const [showPostModal, setShowPostModal] = useState(!isOnHomePosts);
    const [width, setWidth] = useState(window.innerWidth);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const changeModalStatus = () => {
      setShowPostModal((prevBoolean) => !prevBoolean);
    };
    const changeLikesModalStatus = () => {
      setShowLikesModal((prevBoolean) => !prevBoolean);
    };
    useEffect(() => {
      if (width < 768 && isOnHomePosts === false) {
        setShowPostModal(false);
      }
    }, []);

    useEffect(() => {
      let hasFetched = false;
      const postDoc = doc(getFirestore(), `posts/${postInfo.id}`);
      const unsubscribe = onSnapshot(postDoc, (snapshot) => {
        console.log("ON SNAPSHOT");
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
        data-testid="StandardPost Wrapper"
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
              cursor="pointer"
              onClick={() =>
                navigate(`/profile/${postUser.id}`, { replace: true })
              }
              data-testid="Username and Profile Picture Container"
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
                <BsThreeDots
                  onClick={() => setShowDeleteButton(true)}
                  data-testid="three dots"
                />
                {showDeleteButton ? (
                  <DeletePostButton
                    onClick={(e) => {
                      deletePost(post);
                    }}
                    data-testid="Delete Post Button"
                  >
                    Delete
                  </DeletePostButton>
                ) : null}
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
            <PostIcons
              post={postInfo}
              user={user}
              changeModalStatus={changeModalStatus}
              changePostToShow={changePostToShow}
              largeModal={false}
            />
            {postInfo.likes.length > 0 ? (
              <FlexContainer direction="row" gap="0.6rem">
                <PostTextBold onClick={changeLikesModalStatus} cursor="pointer">
                  {postInfo.likes.length}{" "}
                  {postInfo.likes.length === 1 ? "like" : "likes"}
                </PostTextBold>
              </FlexContainer>
            ) : null}
            <PostText>
              <PostTextBold cursor="pointer">{postUser.username}</PostTextBold>
              &nbsp;&nbsp;{post.caption}
            </PostText>
            {postInfo.comments.length > 0 ? (
              <ClickablePostGreyText onClick={changeModalStatus}>
                View all {postInfo.comments.length}{" "}
                {postInfo.comments.length > 1 ? "comments" : "comment"}
              </ClickablePostGreyText>
            ) : null}

            <PostGreyText>
              {`${formatDistanceToNow(
                (postInfo.timestamp as Timestamp).toDate()
              )} ago`}
            </PostGreyText>
          </FlexContainer>
          <AddComment post={postInfo} />
        </FlexContainer>
        {showPostModal === true && (
          <PostModal
            post={postInfo}
            changeModalStatus={changeModalStatus}
            width={width}
            changePostToShow={changePostToShow}
            changeLikesModalStatus={changeLikesModalStatus}
          />
        )}
        {showLikesModal === true && (
          <Modal
            name={"Likes"}
            usersID={post.likes}
            changeModalStatus={changeLikesModalStatus}
            noUsersMessage="There are no likes on this post"
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
  ${({ isOnHomePosts }) =>
    isOnHomePosts === true &&
    css`
      margin-bottom: 0rem;
      margin-top: 0rem;
      width: min(100%, 614px);
      @media only screen and (min-width: 614px) {
        border: 1px solid ${({ theme }) => theme.palette.common.grey};
      }
    `}
`;

const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1.1;
  @media only screen and (min-width: 540px) {
    aspect-ratio: 1/1.1;
  }
`;

export default StandardPost;
