import styled from "styled-components";
const FileInput = styled.input`
  padding: 0.1rem;
  font-size: 1.3rem;
  width: 200px;
  font-family: ${({ theme }) => theme.primaryFont};
  @media only screen and (min-width: 768px) {
    font-size: 1.4rem;
  }
`;
export default FileInput;
