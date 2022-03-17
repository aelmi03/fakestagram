import styled from "styled-components";

const FormButton = styled.button`
  width: 80%;
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.5rem;
  text-align: center;
  padding: 0.7rem;
  font-weight: bold;
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
`;

export default FormButton;
