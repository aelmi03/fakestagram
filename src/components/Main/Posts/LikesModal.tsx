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
    <ModalWrapper onClick={changeLikesModalStatus}>
      <LikesModalWrapper onClick={(e) => e.stopPropagation()}>
        <ReturnBack
          name="Likes"
          onClick={changeLikesModalStatus}
          staticPositioning={true}
          keepBackIcon={true}
        ></ReturnBack>
        <FlexContainer direction="column" padding="0.5rem" overflowY="scroll">
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
  padding: 0rem 0rem;
  display: grid;
  grid-template-rows: max-content 1fr;
  justify-items: center;
  width: 100%;
  gap: 1.5rem;
  height: 100vh;
  background-color: ${({ theme }) => theme.palette.primaryLight};

  @media only screen and (min-width: 768px) {
    border: 1px solid ${({ theme }) => theme.palette.common.grey};
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 550px;
    max-height: 400px;
    border-radius: 5px;
  }
`;
export default LikesModal;
