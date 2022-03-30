import styled from "styled-components";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import Comment from "./Comment";
import HorizontalLine from "../utils/HorizontalLine";
import { doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import React from "react";
interface IProps {
  post: Post;
  postUser: User;
}
interface CommentData {
  timestamp: Timestamp;
  content: string;
  user: User;
  id: string;
}
const Comments = React.memo(({ post, postUser }: IProps) => {
  console.log("COMMENTS :))");
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const postComments: CommentData[] = await Promise.all(
        post.comments.map(async (comment): Promise<CommentData> => {
          const userDoc = doc(getFirestore(), `users/${comment.user}`);
          const userSnapshot = await getDoc(userDoc);

          return {
            content: comment.content,
            timestamp: comment.timestamp as Timestamp,
            user: userSnapshot.data() as User,
            id: comment.id,
          };
        })
      );
      setComments(postComments);
    };
    loadComments();
  }, [post]);
  return (
    <CommentsWrapper>
      <Comment
        timestamp={post.timestamp as Timestamp}
        content={post.caption}
        user={postUser}
      />
      <CommentsLine />

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
});
const CommentsLine = styled(HorizontalLine)`
  height: 1px;
  border: none;
  background-color: ${({ theme }) => theme.palette.common.grey};
`;
const CommentsWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: 1.5rem;
  overflow-y: scroll;
  padding: 0.5rem 1.2rem;
  z-index: 10;
`;

export default Comments;
