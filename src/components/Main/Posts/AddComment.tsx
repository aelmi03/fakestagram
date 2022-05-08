import { doc, getFirestore, Timestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { selectUser } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import Post, { Comment } from "../../utils/PostInterface";
import { BasicText, PostCommentText } from "../../utils/Texts";
import { nanoid } from "@reduxjs/toolkit";
interface IProps {
  post: Post;
}
const AddComment = React.memo(({ post }: IProps) => {
  const user = useAppSelector(selectUser);
  const [comment, setComment] = useState("");
  const postComment = async () => {
    if (comment.replace(/ /g, "").length === 0) return;
    const postDoc = doc(getFirestore(), `posts/${post.id}`);
    const newComment: Comment = {
      user: user.id,
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
        name="Comment"
      />
      <BasicText
        fontSize="1.4rem"
        fontWeight="500"
        cursor="pointer"
        fadeText={comment.replace(/ /g, "").length === 0}
        onClick={postComment}
        color="blue"
      >
        Post
      </BasicText>
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
  z-index: 1;
`;

const PostCommentTextArea = styled.textarea`
  padding: 0.3rem;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
`;

export default AddComment;
