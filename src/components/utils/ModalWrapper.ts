import styled from "styled-components";
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 11;
  input[type="file"]::file-selector-button {
    border-radius: 5px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    font-family: ${({ theme }) => theme.primaryFont};
    border: none;
    font-size: 1.2rem;
    padding: 0.6rem 0.6rem;
    cursor: pointer;
    @media only screen and (min-width: 411px) {
      font-size: 1.4rem;
      padding: 0.75rem 0.9rem;
    }
  }
`;

export default ModalWrapper;
