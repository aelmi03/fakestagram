import FlexContainer from "../utils/FlexContainer";
import Comments from "./Comments";
import ReturnBack from "../utils/ReturnBack";
import AddComment from "./AddComment";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import styled from "styled-components";
import ModalWrapper from "../utils/ModalWrapper";
interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const SmallModal = ({ post, postUser, changeModalStatus }: IProps) => {
  return (
    <SmallModalWrapper>
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

        <ReturnBackWrapper>
          <AddComment post={post} postUser={postUser} />
        </ReturnBackWrapper>
      </FlexContainer>
    </SmallModalWrapper>
  );
};
const SmallModalWrapper = styled(ModalWrapper)`
  z-index: 5;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 5rem;
`;
const ReturnBackWrapper = styled.div`
  position: fixed;
  bottom: 6.5rem;
  left: 0;
  right: 0;
`;
export default SmallModal;
