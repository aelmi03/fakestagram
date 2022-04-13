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
export const PostCommentText = styled(PostText)`
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
