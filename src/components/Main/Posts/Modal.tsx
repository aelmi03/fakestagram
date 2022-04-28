import styled from "styled-components";
import { useAppSelector } from "../../../app/hooks";
import { selectUser, User } from "../../../features/user/userSlice";
import { selectAllUsers } from "../../../features/users/usersSlice";
import FlexContainer from "../../utils/FlexContainer";
import ModalWrapper from "../../utils/ModalWrapper";
import ReturnBack from "../../utils/ReturnBack";
import { BasicText } from "../../utils/Texts";
import UserDetail from "../../utils/UserDetail";

interface IProps {
  name: string;
  usersID: string[];
  changeModalStatus: () => void;
  noUsersMessage: string;
}
const Modal = ({
  usersID,
  changeModalStatus,
  name,
  noUsersMessage,
}: IProps) => {
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);

  return (
    <ModalWrapper onClick={changeModalStatus} data-testid="LikesModal Wrapper">
      <LikesModalWrapper onClick={(e) => e.stopPropagation()}>
        <ReturnBack
          name={name}
          onClick={changeModalStatus}
          staticPositioning={true}
          keepBackIcon={true}
        ></ReturnBack>
        <FlexContainer
          direction="column"
          padding="0.5rem"
          overflowY="scroll"
          gap="1.5rem"
        >
          {usersID.length > 0 ? (
            usersID.map((id: string) => {
              const likedUser: User =
                id === user.id
                  ? user
                  : users.filter((user) => user.id === id)[0];

              return <UserDetail otherUser={likedUser} key={likedUser.id} />;
            })
          ) : (
            <TextContainer>
              <BasicText fontSize="1.3rem" color="grey" fontWeight="500">
                {noUsersMessage}
              </BasicText>
            </TextContainer>
          )}
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
    max-width: 450px;
    max-height: 400px;
    border-radius: 5px;
  }
`;
const TextContainer = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
export default Modal;
