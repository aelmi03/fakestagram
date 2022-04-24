import styled, { css } from "styled-components";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import FlexContainer from "./FlexContainer";
import CircularUserImage from "./CircularUserImage";
import { isEntityName } from "typescript";
import { User } from "../../features/user/userSlice";

interface IProps {
  name: string;
  onClick: () => void;
  staticPositioning?: boolean;
  onChatIconClick?: () => void;
  user?: User;
  onChatAccountClicked?: (chatAccount: User) => void;
}
const ReturnBack = ({
  name,
  onClick,
  onChatIconClick,
  staticPositioning,
  user,
  onChatAccountClicked,
}: IProps) => {
  return (
    <ReturnBackWrapper
      data-testid="Return Back Wrapper"
      staticPositioning={staticPositioning}
      chatIconClick={onChatIconClick}
    >
      <IoIosArrowBack onClick={onClick} data-testid="Go back" />
      {user && onChatAccountClicked ? (
        <FlexContainer
          direction="row"
          gap="0.9rem"
          alignItems="center"
          justifyContent="center"
          padding="0rem 1rem 0rem 0rem"
          cursor="pointer"
          width={"max-content"}
          margin="0 auto"
          onClick={() => onChatAccountClicked(user)}
        >
          <CircularUserImage size="30px" src={user.profilePicture} />
          <NameText margin={false}>{name}</NameText>
        </FlexContainer>
      ) : (
        <NameText>{name}</NameText>
      )}
      {onChatIconClick ? (
        <FaRegEdit onClick={onChatIconClick} data-testid="Chat Icon" />
      ) : null}
    </ReturnBackWrapper>
  );
};
const ReturnBackWrapper = styled.div<{
  staticPositioning?: boolean;
  chatIconClick?: () => void;
}>`
  width: 100%;
  padding: 1.3rem 1.6rem;
  display: grid;
  align-items: center;
  position: fixed;
  grid-template-columns: max-content 1fr max-content;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  z-index: 5;
  top: 0px;
  left: 0px;
  svg {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    height: 25px;
    width: 25px;
    cursor: pointer;
  }
  ${({ chatIconClick }) =>
    chatIconClick &&
    css`
      p {
        margin-left: 20px;
      }
    `}
  ${({ staticPositioning }) =>
    staticPositioning === true &&
    css`
      font-size: 1.6rem;
      position: static;
      border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
      @media only screen and (min-width: 768px) {
        > :nth-child(1) {
          display: none;
        }
        display: flex;
        justify-content: space-between;
        height: 57px;
      }
    `}
    ${({ staticPositioning }) =>
    !staticPositioning &&
    css`
      @media only screen and (min-width: 768px) {
        display: none;
        justify-items: center;
      }
    `}
`;
const NameText = styled.p<{ margin?: boolean }>`
  font-family: ${({ theme }) => theme.primaryFont};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-size: 1.65rem;
  font-weight: 600;
  text-align: center;
  margin-right: 2.8rem;
  ${({ margin }) =>
    margin === false &&
    css`
      margin: 0;
    `}
`;
export default ReturnBack;
