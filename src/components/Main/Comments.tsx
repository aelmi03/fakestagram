import styled from "styled-components";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import Comment from "./Comment";
import HorizontalLine from "../utils/HorizontalLine";
interface IProps {
  post: Post;
  postUser: User;
}
const Comments = ({ post, postUser }: IProps) => {
  return (
    <CommentsWrapper>
      <Comment
        timestamp={post.timestamp}
        content={post.caption}
        user={postUser}
      />
      <CommentsLine />
    </CommentsWrapper>
  );
};
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
  padding: 0rem 1.2rem;
  margin-top: 2rem;
  z-index: 10;
`;

export default Comments;
