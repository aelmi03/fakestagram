import styled from "styled-components";
import { PostCommentText } from "../utils/Texts";
const AddComment = () => {
  return (
    <PostCommentsContainer>
      <PostCommentTextArea placeholder="Add Comment" />
      <PostCommentText>Post</PostCommentText>
    </PostCommentsContainer>
  );
};

const PostCommentsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
  background-color: ${({ theme }) => theme.palette.primaryLight};
`;

const PostCommentTextArea = styled.textarea`
  padding: 0.3rem;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
`;

export default AddComment;
