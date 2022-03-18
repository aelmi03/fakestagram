import styled from "styled-components";

const Label = styled.label`
  font-size: 1rem;
  font-family: ${({ theme }) => theme.primaryFont};
  color: ${({ theme }) => theme.palette.common.black};
`;

export default Label;
