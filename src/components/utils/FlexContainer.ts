import styled, { css } from "styled-components";

const FlexContainer = styled.div<{
  direction: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: string;
  padding?: string;
  width?: string;
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
  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `};
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `};
  ${({ alignContent }) =>
    alignContent &&
    css`
      align-content: ${alignContent};
    `};
`;

export default FlexContainer;
