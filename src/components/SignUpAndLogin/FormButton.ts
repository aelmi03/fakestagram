import styled from "styled-components";

const FormButton = styled.button`
  width: 84%;
  font-family: sans-serif;
  font-size: 1.35rem;
  text-align: center;
  padding: 0.7rem;
  font-weight: bold;
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  :disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

export default FormButton;
