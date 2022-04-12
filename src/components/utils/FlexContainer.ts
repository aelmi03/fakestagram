import styled, { css } from "styled-components";

const FlexContainer = styled.div<{
  direction: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: string;
  padding?: string;
  width?: string;
  height?: string;
  overflowY?: string;
  flexGrow?: string;
  margin?: string;
  position?: string;
  cursor?: string;
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
  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `};
  ${({ overflowY }) =>
    overflowY &&
    css`
      overflow-y: ${overflowY};
    `};
  ${({ margin }) =>
    margin &&
    css`
      margin: ${margin};
    `};
  ${({ alignContent }) =>
    alignContent &&
    css`
      align-content: ${alignContent};
    `};
  ${({ flexGrow }) =>
    flexGrow &&
    css`
      flex-grow: ${flexGrow};
    `};
  ${({ position }) =>
    position &&
    css`
      position: ${position};
    `};
  ${({ cursor }) =>
    cursor &&
    css`
      cursor: ${cursor};
    `};
`;

export default FlexContainer;
