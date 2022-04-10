import styled from "styled-components";
const Loader = styled.div`
  border: 6px solid ${({ theme }) => theme.palette.neutral};
  border-top: 6px solid ${({ theme }) => theme.palette.secondary.main};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1.5s linear infinite;
  @media only screen and (min-width: 540px) {
    width: 100px;
    height: 100px;
    border: 10px solid ${({ theme }) => theme.palette.neutral};
    border-top: 10px solid ${({ theme }) => theme.palette.secondary.main};
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
