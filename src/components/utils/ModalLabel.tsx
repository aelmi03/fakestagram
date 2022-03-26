import styled from "styled-components";
const ModalLabel = styled.label`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.primary.contrastText};

  @media only screen and (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

export default ModalLabel;
