import styled from "styled-components";

const SignUpAndLogin = () => {
  return <SignUpAndLoginWrapper></SignUpAndLoginWrapper>;
};

const SignUpAndLoginWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;

export default SignUpAndLogin;
