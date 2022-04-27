import styled from "styled-components";
import { useAppSelector } from "../../../app/hooks";
import { selectUser, User } from "../../../features/user/userSlice";
import { selectAllUsers } from "../../../features/users/usersSlice";
import FlexContainer from "../../utils/FlexContainer";
import ModalWrapper from "../../utils/ModalWrapper";
import Post from "../../utils/PostInterface";
import ReturnBack from "../../utils/ReturnBack";
import UserDetail from "../../utils/UserDetail";

interface IProps {
  post: Post;
  changeLikesModalStatus: () => void;
}
const LikesModal = ({ post, changeLikesModalStatus }: IProps) => {
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);

  return (
    <ModalWrapper>
      <LikesModalWrapper>
        <ReturnBack
          name=""
          onClick={changeLikesModalStatus}
          staticPositioning={true}
          keepBackIcon={true}
        ></ReturnBack>
        <FlexContainer direction="column" padding="0.3rem" overflowY="scroll">
          {post.likes.map((id: string) => {
            const likedUser: User =
              id === user.id ? user : users.filter((user) => user.id === id)[0];

            return <UserDetail otherUser={likedUser} />;
          })}
        </FlexContainer>
      </LikesModalWrapper>
    </ModalWrapper>
  );
};
const LikesModalWrapper = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-rows: max-content 1fr;
  justify-items: center;
  width: min(95%, 500px);
  overflow-y: scroll;
  max-height: 400px;
  gap: 4.5rem;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
export default LikesModal;
