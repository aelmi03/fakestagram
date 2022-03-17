import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  padding: 2rem;
  flex-flow: column nowrap;
  align-items: center;
  gap: 0.8rem;
  width: min(100%, 350px);
  background-color: ${({ theme }) => theme.palette.common.white};
`;

export default FormContainer;
