import styled from "styled-components";

import {
  BsThreeDots,
  BsChatDots,
  BsBookmark,
  BsBookmarkFill,
  BsSuitHeart,
  BsSuitHeartFill,
} from "react-icons/bs";
import { Bookmark, Heart } from "../utils/SVGS";
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
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
interface IProps {
  post: Post;
  postUser: User;
}
const StandardPost = ({ post, postUser }: IProps) => {
  const user = useAppSelector(selectUser);
  const [postInfo, setPostInfo] = useState<Post>(post);
  const [showPostModal, setShowPostModal] = useState(false);
  const changeModalStatus = () => {
    setShowPostModal((prevBoolean) => !prevBoolean);
  };
  const userHasSavedPost = () => {
    return user.savedPosts.includes(post.id);
  };
  const userHasLikedPost = () => {
    return postInfo.likes.includes(user.id);
  };
  const clickLikeIcon = async () => {
    let likes: string[] = [];
    if (postInfo.likes.includes(user.id)) {
      likes = [...postInfo.likes].filter((id) => id !== user.id);
    } else {
      likes = [...postInfo.likes, user.id];
    }
    const postDoc = doc(getFirestore(), `posts/${postInfo.id}`);
    await updateDoc(postDoc, {
      likes,
    });
  };
  useEffect(() => {
    const postDoc = doc(getFirestore(), `posts/${postInfo.id}`);
    const unsubscribe = onSnapshot(postDoc, (snapshot) => {
      setPostInfo(snapshot.data() as Post);
    });
    return () => {
      unsubscribe();
    };
  }, [postInfo, user]);
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
            {userHasLikedPost() ? (
              <BsSuitHeartFill
                style={{ color: "red" }}
                title="Unlike this post"
                onClick={clickLikeIcon}
              />
            ) : (
              <BsSuitHeart title="Like this post" onClick={clickLikeIcon} />
            )}
            <BsChatDots onClick={changeModalStatus} title={"View comments"} />
          </FlexContainer>
          {userHasSavedPost() ? (
            <BsBookmarkFill title={`Unsave this post`} />
          ) : (
            <BsBookmark title={"Save this post"} />
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
          {`${formatDistanceToNow(postInfo.timestamp.toDate())} ago`}
        </PostGreyText>
      </FlexContainer>
      <AddComment />
      {showPostModal === true && (
        <PostModal
          postUser={postUser}
          post={postInfo}
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
