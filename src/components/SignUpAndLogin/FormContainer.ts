import styled from "styled-components";

const FormContainer = styled.form`
  display: grid;
  padding: 4rem 2rem;
  align-items: center;
  justify-items: center;
  gap: 0.8rem;
  width: min(100%, 350px);
  background-color: ${({ theme }) => theme.palette.common.white};
  @media only screen and (min-width: 540px) {
    border: 1px solid ${({ theme }) => theme.palette.common.grey};
  }
  > :first-child {
    margin-bottom: 2rem;
  }
`;

export default FormContainer;
