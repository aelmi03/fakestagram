import styled from "styled-components";

interface IProps {
  onClick: () => void;
  status: string;
}
const Switch = ({ onClick, status }: IProps) => {
  return (
    <SwitchWrapper>
      <SwitchText>
        {status === "Log In" ? "Don't have an account? " : "Have an account? "}{" "}
        <SwitchLink onClick={onClick}>
          {status === "Log In" ? "Sign up" : "Log in"}
        </SwitchLink>
      </SwitchText>
    </SwitchWrapper>
  );
};
const SwitchWrapper = styled.div`
  width: min(100%, 350px);
  display: flex;
  justify-content: center;
  padding: 2.4rem;
  @media only screen and (min-width: 540px) {
    background-color: ${({ theme }) => theme.palette.common.white};
    border: 1px solid ${({ theme }) => theme.palette.common.grey};
  }
`;
const SwitchText = styled.p`
  font-size: 1.4rem;
  font-family: sans-serif;
`;

const SwitchLink = styled.a`
  font-size: 1.4rem;
  cursor: pointer;
  font-family: sans-serif;
  color: ${({ theme }) => theme.palette.secondary.main};
  width: auto;
`;

export default Switch;
