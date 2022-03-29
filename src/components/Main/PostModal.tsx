import { User } from "../../features/user/userSlice";
import ModalWrapper from "../utils/ModalWrapper";
import ReturnBack from "../utils/ReturnBack";
import Post from "../utils/PostInterface";
import Comments from "./Comments";
import styled from "styled-components";
import AddComment from "./AddComment";
import FlexContainer from "../utils/FlexContainer";

interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const PostModal = ({ post, postUser, changeModalStatus }: IProps) => {
  return (
    <PostModalWrapper>
      <FlexContainer direction="column" height="100%">
        <FlexContainer direction="column" height="75%">
          <ReturnBack
            name="Comments"
            onClick={() => {
              changeModalStatus();
            }}
          />
          <Comments post={post} postUser={postUser} />
        </FlexContainer>
        <AddComment />
      </FlexContainer>
    </PostModalWrapper>
  );
};
const PostModalWrapper = styled(ModalWrapper)`
  z-index: 5;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 5rem;
`;
export default PostModal;
