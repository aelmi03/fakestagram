import styled from "styled-components";
import Login from "./Login";

const SignUpAndLogin = () => {
  return (
    <SignUpAndLoginWrapper>
      <Login />
    </SignUpAndLoginWrapper>
  );
};

const SignUpAndLoginWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.common.white};
`;

export default SignUpAndLogin;
