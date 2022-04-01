import styled, { css } from "styled-components";
const DeletePostButton = styled.button<{ show: boolean }>`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.lightRed};
  font-size: 1.4rem;
  font-family: ${({ theme }) => theme.primaryFont};
  padding: 1.3rem 2rem;
  position: absolute;
  top: 8px;
  right: 30px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  ${({ show }) =>
    show === false &&
    css`
      display: none;
    `}
`;
export default DeletePostButton;
