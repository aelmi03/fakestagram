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
interface CommentData {
  timestamp: Timestamp;
  content: string;
  user: User;
  id: string;
}
const Comments = React.memo(
  ({ post }: IProps) => {
    console.log("COMMENTS :))");
    const [comments, setComments] = useState<CommentData[]>([]);
    const users = useAppSelector(selectAllUsers);

    useEffect(() => {
      const loadComments = () => {
        const postComments: CommentData[] = post.comments.map(
          (comment): CommentData => {
            const commentUser = users.filter(
              (user) => user.id === comment.user
            )[0] as User;

            return {
              content: comment.content,
              timestamp: comment.timestamp as Timestamp,
              user: commentUser,
              id: comment.id,
            };
          }
        );
        setComments(postComments);
      };
      loadComments();
    }, [post]);
    return (
      <CommentsWrapper data-testid="Comments Wrapper">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            timestamp={comment.timestamp}
            user={comment.user}
            content={comment.content}
          />
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
