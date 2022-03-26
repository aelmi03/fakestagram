import styled from "styled-components";
import StyledInput from "../SignUpAndLogin/StyledInput";
const ModalInput = styled(StyledInput)`
  width: auto;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.primaryFont};

  @media only screen and (min-width: 540px) {
    width: 80%;
    flex-grow: 0;
  }
`;
export default ModalInput;
