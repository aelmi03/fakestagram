import styled, { css } from "styled-components";

const FlexContainer = styled.div<{
  direction: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
}>`
  display: flex;
  width: 100%;
  flex-flow: ${({ direction }) => direction};
  ${({ justifyContent }) =>
    justifyContent &&
    css`
      justify-content: ${justifyContent};
    `};
  ${({ alignItems }) =>
    alignItems &&
    css`
      align-items: ${alignItems};
    `};
  ${({ gap }) =>
    gap &&
    css`
      gap: ${gap};
    `};
`;

export default FlexContainer;
