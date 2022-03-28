import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
interface IProps {
  name: string;
  onClick: () => void;
}
const ReturnBack = ({ name, onClick }: IProps) => {
  return (
    <ReturnBackWrapper>
      <NameText>{name}</NameText>
      <IoIosArrowBack onClick={onClick} />
    </ReturnBackWrapper>
  );
};
const ReturnBackWrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 1.6rem;
  svg {
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`;
const NameText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-size: 1.6rem;
  font-weight: 800;
  text-align: center;
`;
export default ReturnBack;
