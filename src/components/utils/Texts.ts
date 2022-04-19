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
  wrap?: boolean;
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
  ${({ ellipseText }) =>
    ellipseText === true &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
    ${({ wrap }) =>
    wrap === false &&
    css`
      white-space: nowrap;
    `}
`;
export const PostCommentText = styled(PostText)`
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
