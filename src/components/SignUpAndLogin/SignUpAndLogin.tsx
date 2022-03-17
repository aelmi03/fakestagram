import styled from "styled-components";
import Login from "./Login";
import Signup from "./Signup";
import Switch from "./Switch";

const SignUpAndLogin = () => {
  return (
    <SignUpAndLoginWrapper>
      <Signup />
      <Switch />
    </SignUpAndLoginWrapper>
  );
};

const SignUpAndLoginWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: grid;
  justify-items: center;
  align-content: center;
  background-color: ${({ theme }) => theme.palette.common.white};
`;

export default SignUpAndLogin;
