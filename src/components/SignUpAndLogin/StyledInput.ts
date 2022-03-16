import styled from "styled-components";

const StyledInput = styled.input`
  width: 80%;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  padding: 0.8rem;
  font-family: sans-serif;
`;

export default StyledInput;
