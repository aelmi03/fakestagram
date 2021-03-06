import styled, { css } from "styled-components";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import FlexContainer from "./FlexContainer";
import CircularUserImage from "./CircularUserImage";
import { User } from "../../features/user/userSlice";

interface IProps {
  name: string;
  onClick: () => void;
  staticPositioning?: boolean;
  onChatIconClick?: () => void;
  user?: User;
  onChatAccountClicked?: (chatAccount: User) => void;
  keepBackIcon?: boolean;
}
const ReturnBack = ({
  name,
  onClick,
  onChatIconClick,
  staticPositioning,
  user,
  onChatAccountClicked,
  keepBackIcon,
}: IProps) => {
  return (
    <ReturnBackWrapper
      data-testid="Return Back Wrapper"
      staticPositioning={staticPositioning}
      chatIconClick={onChatIconClick}
      keepBackIcon={keepBackIcon}
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
          data-testid="Profile Picture and Username Container"
          onClick={() => onChatAccountClicked(user)}
        >
          <AccountImage
            size="30px"
            src={user.profilePicture}
            data-testid="Account Image"
          />
          <NameText margin={false} data-testid="Name">
            {name}
          </NameText>
        </FlexContainer>
      ) : (
        <NameText data-testid="Name">{name}</NameText>
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
  keepBackIcon?: boolean;
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
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};

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
      @media only screen and (min-width: 768px) {
        > :nth-child(1) {
          display: none;
        }
        display: flex;
        justify-content: space-between;
        height: 57px;
      }
    `}
    ${({ keepBackIcon }) =>
    keepBackIcon === true &&
    css`
      @media only screen and (min-width: 768px) {
        > :nth-child(1) {
          display: block;
        }
        display: grid;
        grid-template-columns: max-content 1fr;
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
const AccountImage = styled(CircularUserImage)`
  @media only screen and (min-width: 540px) {
    width: 45px;
    height: 45px;
    min-width: 45px;
  }
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
