import styled, { css } from "styled-components";

const Button = styled.button<{ color?: string }>`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.2rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  padding: 0.8rem 2rem;
  width: 100px;
  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
  ${({ color }) =>
    color === "red" &&
    css`
      color: ${({ theme }) => theme.palette.lightRed};
      background-color: ${({ theme }) => theme.palette.primary.main};
      border: 1px solid ${({ theme }) => theme.palette.common.grey};
    `}
  @media only screen and (min-width: 540px) {
    font-size: 1.5rem;
    width: 170px;
  }
`;

export default Button;
