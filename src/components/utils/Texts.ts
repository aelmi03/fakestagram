import styled, { css } from "styled-components";
export const PostText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 400;
  white-space: wrap;
  display: inline;
  word-break: break-word;
`;

export const PostTextBold = styled.span<{ cursor?: string }>`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 650;
  ${({ cursor }) =>
    cursor &&
    css`
      cursor: pointer;
    `}
`;
export const PostGreyText = styled(PostText)`
  color: ${({ theme }) => theme.palette.darkGrey};
`;
export const ClickablePostGreyText = styled(PostGreyText)`
  cursor: pointer;
`;
export const BasicText = styled.p<{
  fontWeight: string;
  fontSize: string;
  color?: string;
  ellipseText?: boolean;
  wrapText?: boolean;
  fadeText?: boolean;
  cursor?: string;
  textAlign?: string;
}>`
  font-family: ${({ theme }) => theme.primaryFont};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  ${({ color }) =>
    color === "grey" &&
    css`
      color: ${({ theme }) => theme.palette.darkGrey};
    `}
  ${({ color }) =>
    color === "blue" &&
    css`
      color: ${({ theme }) => theme.palette.secondary.main};
    `}
    
  ${({ ellipseText }) =>
    ellipseText === true &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
    ${({ wrapText }) =>
    wrapText === false &&
    css`
      white-space: nowrap;
    `}
    ${({ fadeText }) =>
    fadeText === true &&
    css`
      opacity: 0.5;
    `}
    ${({ cursor }) =>
    cursor &&
    css`
      cursor: pointer;
    `}
    ${({ textAlign }) =>
    textAlign &&
    css`
      text-align: ${textAlign};
    `}
`;
export const PostCommentText = styled(PostText)`
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
