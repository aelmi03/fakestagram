import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  padding: 0.7rem 0.5rem;
  font-family: sans-serif;
  font-size: 1.1rem;
  position: relative;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;

export default StyledInput;
