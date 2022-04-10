import styled from "styled-components";
const DeletePostButton = styled.button`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.lightRed};
  font-size: 1.4rem;
  font-family: ${({ theme }) => theme.primaryFont};
  padding: 1.3rem 2rem;
  position: absolute;
  right: 30px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
`;
export default DeletePostButton;
