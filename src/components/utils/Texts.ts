import styled from "styled-components";
export const PostText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 400;
  white-space: wrap;
  display: inline;
`;

export const PostTextBold = styled.span`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: bold;
`;
export const PostGreyText = styled(PostText)`
  color: ${({ theme }) => theme.palette.darkGrey};
`;
export const PostCommentText = styled(PostText)`
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;
