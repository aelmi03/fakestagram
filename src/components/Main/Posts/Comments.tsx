import styled from "styled-components";
import Post from "../../utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Comment from "./Comment";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import React from "react";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { useAppSelector } from "../../../app/hooks";
interface IProps {
  post: Post;
}

const Comments = React.memo(
  ({ post }: IProps) => {
    console.log("COMMENTS :))");

    return (
      <CommentsWrapper data-testid="Comments Wrapper">
        {post.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </CommentsWrapper>
    );
  },
  (nextProps, prevProps) => nextProps.post === prevProps.post
);

const CommentsWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: 1.6rem;
  z-index: 10;
  margin-top: 1.6rem;
`;

export default Comments;
