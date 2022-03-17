import { useRef, useState } from "react";
import styled from "styled-components";
import Login from "./Login";
import Signup from "./Signup";
import Switch from "./Switch";

const SignUpAndLogin = () => {
  const [status, setStatus] = useState("Sign Up");
  const changeStatus = () => {
    if (status === "Sign Up") {
      setStatus("Log In");
    } else {
      setStatus("Sign Up");
    }
  };
  return (
    <SignUpAndLoginWrapper>
      {status === "Sign Up" ? <Signup /> : <Login />}
      <Switch onClick={changeStatus} status={status} />
    </SignUpAndLoginWrapper>
  );
};

const SignUpAndLoginWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 1.3rem;
  background-color: ${({ theme }) => theme.palette.common.white};
  @media only screen and (min-width: 540px) {
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export default SignUpAndLogin;
