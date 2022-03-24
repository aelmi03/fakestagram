import styled from "styled-components";
const ModalLabel = styled.label`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.2rem;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

export default ModalLabel;
