import styled, { css } from "styled-components";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

interface IProps {
  name: string;
  onClick: () => void;
  stickyPositioning?: boolean;
  onChatIconClick?: () => void;
}
const ReturnBack = ({
  name,
  onClick,
  onChatIconClick,
  stickyPositioning,
}: IProps) => {
  return (
    <ReturnBackWrapper
      data-testid="Return Back Wrapper"
      stickyPositioning={stickyPositioning}
      onChatIconClick={onChatIconClick}
    >
      <IoIosArrowBack onClick={onClick} data-testid="Go back" />
      <NameText>{name}</NameText>
      {onChatIconClick ? <FaRegEdit /> : null}
    </ReturnBackWrapper>
  );
};
const ReturnBackWrapper = styled.div<{
  stickyPositioning?: boolean;
  onChatIconClick?: () => void;
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
  }
  ${({ onChatIconClick }) =>
    onChatIconClick &&
    css`
      p {
        margin-left: 20px;
      }
    `}
  ${({ stickyPositioning }) =>
    stickyPositioning === true &&
    css`
      position: sticky;
      border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
    `}
  @media only screen and (min-width: 768px) {
    display: none;
  }
`;
const NameText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-size: 1.65rem;
  font-weight: 600;
  text-align: center;
  margin-right: 2.8rem;
`;
export default ReturnBack;
