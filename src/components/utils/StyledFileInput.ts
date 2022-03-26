import styled from "styled-components";
const FileInput = styled.input`
  padding: 0.1rem;
  font-size: 1.3rem;
  width: 180px;
  font-family: ${({ theme }) => theme.primaryFont};
  @media only screen and (min-width: 768px) {
    font-size: 1.4rem;
    width: 210px;
  }
`;
export default FileInput;
