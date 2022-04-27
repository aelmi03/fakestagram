import ModalWrapper from "../../utils/ModalWrapper";
import styled from "styled-components";
import Post from "../../utils/PostInterface";
import { selectUser, User } from "../../../features/user/userSlice";
import CircularUserImage from "../../utils/CircularUserImage";
import { PostTextBold, PostGreyText } from "../../utils/Texts";
import FlexContainer from "../../utils/FlexContainer";
import { BsThreeDots } from "react-icons/bs";
import HorizontalLine from "../../utils/HorizontalLine";
import React, { useState } from "react";
import Comments from "./Comments";
import Comment from "./Comment";
import { formatDistanceToNow } from "date-fns";
import { checkEquality, deletePost } from "../../utils/utilityFunctions";
import AddComment from "./AddComment";
import { useAppSelector } from "../../../app/hooks";
import DeletePostButton from "../../utils/DeletePostButton";
import PostIcons from "./PostIcons";
interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
  changePostToShow?: (post: Post | null) => void;
  changeLikesModalStatus: () => void;
}
const LargeModal = React.memo(
  ({
    post,
    postUser,
    changeModalStatus,
    changePostToShow,
    changeLikesModalStatus,
  }: IProps) => {
    console.log("large modal");
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const user = useAppSelector(selectUser, checkEquality);
    return (
      <ModalWrapper
        onClick={() => {
          if (changePostToShow) {
            changePostToShow(null);
          } else {
            changeModalStatus();
          }
        }}
        data-testid="Large Modal Wrapper"
      >
        <LargeModalWrapper
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteButton(false);
          }}
        >
          <LargePostPicture src={post.imgSrc} alt="photo of the post" />
          <FlexContainer direction="column" gap="0.5rem">
            <FlexContainer direction="column">
              <FlexContainer
                direction="row"
                justifyContent="space-between"
                padding="1rem 1rem"
              >
                <FlexContainer direction="row" gap="1rem" alignItems="center">
                  <CircularUserImage
                    src={postUser.profilePicture}
                    alt={"avatar of profile user"}
                  />
                  <PostTextBold>{postUser.username}</PostTextBold>
                </FlexContainer>
                {user.id === postUser.id ? (
                  <FlexContainer
                    direction="row"
                    width={"max-content"}
                    position="relative"
                  >
                    <BsThreeDots
                      onClick={(e) => {
                        setShowDeleteButton(true);
                        e.stopPropagation();
                      }}
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
                ) : null}{" "}
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
              <Comments post={post} />
            </FlexContainer>
            <FlexContainer
              direction="column"
              padding="1rem 1.6rem"
              gap="0.4rem"
            >
              <PostIcons
                post={post}
                user={user}
                changeModalStatus={changeModalStatus}
                largeModal={true}
              />
              {post.likes.length > 0 ? (
                <PostTextBold cursor="pointer" onClick={changeLikesModalStatus}>
                  {post.likes.length}{" "}
                  {post.likes.length === 1 ? "like" : "likes"}
                </PostTextBold>
              ) : null}

              <PostGreyText>{`${formatDistanceToNow(
                post.timestamp.toDate()
              )} ago`}</PostGreyText>
            </FlexContainer>
            <AddComment post={post} />
          </FlexContainer>
        </LargeModalWrapper>
      </ModalWrapper>
    );
  },
  (nextProps, prevProps) => nextProps.post === prevProps.post
);
const LargeModalWrapper = styled.div`
  display: grid;
  width: min(95%, 1000px);
  max-height: 800px;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: fixed;
  grid-template-columns: 1fr 1fr;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 16;
  @media only screen and (min-width: 1024px) {
    grid-template-columns: 6fr 5fr;
  }
`;
const LargePostPicture = styled.img`
  width: 100%;
  aspect-ratio: 1/1.2;
`;
export default LargeModal;
