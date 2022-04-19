import styled, { css } from "styled-components";
const CircularUserImage = styled.img<{ size?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${({ size }) =>
    size &&
    css`
      width: ${size};
      height: ${size};
      min-width: ${size};
    `};
`;

export default CircularUserImage;
