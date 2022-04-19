import styled, { css } from "styled-components";

const Button = styled.button<{ color?: string }>`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.25rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  padding: 0.8rem 2rem;
  border-radius: 5px;
  ${({ color }) =>
    color === "white" &&
    css`
      background-color: ${({ theme }) => theme.palette.primaryLight};
      border: 1px solid ${({ theme }) => theme.palette.common.grey};
      color: ${({ theme }) => theme.palette.primary.contrastText};
    `}
  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
  @media only screen and (min-width: 375px) {
    font-size: 1.35rem;
  }
  @media only screen and (min-width: 540px) {
    font-size: 1.5rem;
  }
`;

export default Button;
