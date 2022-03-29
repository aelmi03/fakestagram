import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
interface IProps {
  name: string;
  onClick: () => void;
}
const ReturnBack = ({ name, onClick }: IProps) => {
  return (
    <ReturnBackWrapper>
      <IoIosArrowBack onClick={onClick} />
      <NameText>{name}</NameText>
    </ReturnBackWrapper>
  );
};
const ReturnBackWrapper = styled.div`
  width: 100%;
  padding: 1.6rem;
  display: grid;
  align-items: center;
  position: fixed;
  grid-template-columns: max-content 1fr;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  z-index: 5;
  top: 0px;
  left: 0px;
  svg {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    height: 25px;
    width: 25px;
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
