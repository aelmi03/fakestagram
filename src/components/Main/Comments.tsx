import styled from "styled-components";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import Comment from "./Comment";
// interface IProps {
//   post: Post;
//   postUser: User;
// }
const Comments = () => {
  return (
    <CommentsWrapper>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <Comment />
      ))}
    </CommentsWrapper>
  );
};

const CommentsWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: 1.5rem;
  overflow-y: scroll;
  padding: 0rem 1.2rem;
`;

export default Comments;
