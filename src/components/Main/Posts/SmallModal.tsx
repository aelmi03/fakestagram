import FlexContainer from "../../utils/FlexContainer";
import Comments from "./Comments";
import Comment from "./Comment";
import ReturnBack from "../../utils/ReturnBack";
import AddComment from "./AddComment";
import Post from "../../utils/PostInterface";
import { User } from "../../../features/user/userSlice";
import styled from "styled-components";
import ModalWrapper from "../../utils/ModalWrapper";
import HorizontalLine from "../../utils/HorizontalLine";
interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const SmallModal = ({ post, postUser, changeModalStatus }: IProps) => {
  return (
    <SmallModalWrapper>
      <FlexContainer direction="column" height="100%">
        <FlexContainer
          direction="column"
          height="100%"
          overflowY="scroll"
          padding={"1.5rem 1.2rem;"}
        >
          <ReturnBack
            name="Comments"
            onClick={() => {
              changeModalStatus();
            }}
          />
          <FlexContainer direction="column" gap="1rem">
            <Comment
              content={post.caption}
              timestamp={post.timestamp}
              user={postUser}
            />
            <HorizontalLine />
          </FlexContainer>

          <Comments post={post} />
        </FlexContainer>
        <AddComment post={post} />
      </FlexContainer>
    </SmallModalWrapper>
  );
};
const SmallModalWrapper = styled(ModalWrapper)`
  z-index: 40;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 5rem;
`;

export default SmallModal;
