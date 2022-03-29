import { VscHeart } from "react-icons/vsc";
import { BsBookmark } from "react-icons/bs";
import styled, { css } from "styled-components";

export const Heart = styled(VscHeart)<{ liked: boolean }>`
  ${({ liked }) =>
    liked === true &&
    css`
      background-color: ${({ theme }) => theme.palette.lightRed};
    `}
`;

export const Bookmark = styled(BsBookmark)<{ saved: boolean }>`
  ${({ saved }) =>
    saved === true &&
    css`
      background-color: ${({ theme }) => theme.palette.common.black};
    `}
`;
