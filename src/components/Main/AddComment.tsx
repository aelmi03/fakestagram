import {
  doc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { User } from "../../features/user/userSlice";
import Post, { Comment } from "../utils/PostInterface";
import { PostCommentText } from "../utils/Texts";
import { nanoid } from "@reduxjs/toolkit";
interface IProps {
  postUser: User;
  post: Post;
}
const AddComment = React.memo(({ post, postUser }: IProps) => {
  console.log("add comment");
  const [comment, setComment] = useState("");
  const postComment = async () => {
    const postDoc = doc(getFirestore(), `posts/${post.id}`);
    const newComment: Comment = {
      user: postUser.id,
      id: nanoid(),
      content: comment,
      timestamp: new Date() as unknown as Timestamp,
    };
    await updateDoc(postDoc, {
      comments: [...post.comments, newComment],
    });
    setComment("");
  };
  return (
    <PostCommentsContainer>
      <PostCommentTextArea
        placeholder="Add Comment"
        value={comment}
        onChange={(e) => setComment((e.target as HTMLTextAreaElement).value)}
      />
      <PostCommentText onClick={postComment}>Post</PostCommentText>
    </PostCommentsContainer>
  );
});

const PostCommentsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
  background-color: ${({ theme }) => theme.palette.primaryLight};
  z-index: 10;
`;

const PostCommentTextArea = styled.textarea`
  padding: 0.3rem;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
`;

export default AddComment;
