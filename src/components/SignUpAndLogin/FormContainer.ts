import styled from "styled-components";

const FormContainer = styled.form`
  display: flex;
  padding: 4rem 2rem;
  flex-flow: column nowrap;
  align-items: center;
  gap: 0.8rem;
  width: min(100%, 350px);
  background-color: ${({ theme }) => theme.palette.common.white};
  @media only screen and (min-width: 350px) {
    border: 1px solid ${({ theme }) => theme.palette.common.grey};
  }
`;

export default FormContainer;
