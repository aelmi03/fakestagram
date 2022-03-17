import styled from "styled-components";

const Switch = () => {
  return (
    <SwitchWrapper>
      <SwitchText>
        Have an account? <SwitchLink> Log in</SwitchLink>
      </SwitchText>
    </SwitchWrapper>
  );
};
const SwitchWrapper = styled.div`
  width: min(100%, 350px);
  display: flex;
  justify-content: center;
  padding: 3rem;
`;
const SwitchText = styled.p`
  font-size: 1.45rem;
  font-family: sans-serif;
`;

const SwitchLink = styled.a`
  font-size: 1.45rem;
  cursor: pointer;
  font-family: sans-serif;
  color: ${({ theme }) => theme.palette.secondary.main};
  font-family: ${({ theme }) => theme.palette.secondary.main};
`;

export default Switch;
