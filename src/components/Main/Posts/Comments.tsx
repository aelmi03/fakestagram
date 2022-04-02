import styled from "styled-components";
import Post from "../../utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import Comment from "./Comment";
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
const Comments = React.memo(
  ({ post, postUser }: IProps) => {
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
