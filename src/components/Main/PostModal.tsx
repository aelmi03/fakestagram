import { User } from "../../features/user/userSlice";
import ModalWrapper from "../utils/ModalWrapper";
import ReturnBack from "../utils/ReturnBack";
import Post from "../utils/PostInterface";
import Comments from "./Comments";
import styled from "styled-components";

interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const PostModal = ({ post, postUser, changeModalStatus }: IProps) => {
  return (
    <PostModalWrapper>
      <ReturnBack
        name="Comments"
        onClick={() => {
          changeModalStatus();
        }}
      />
      <Comments post={post} postUser={postUser} />
    </PostModalWrapper>
  );
};
const PostModalWrapper = styled(ModalWrapper)`
  background-color: rgba(0, 0, 0, 0);
  z-index: 5;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 5rem;
`;
export default PostModal;
