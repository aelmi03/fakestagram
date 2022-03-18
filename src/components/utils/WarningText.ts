import styled from "styled-components";

const WarningText = styled.p`
  color: ${({ theme }) => theme.palette.lightRed};
  font-size: 1.2rem;
  font-family: sans-serif;
  text-align: center;
`;

export default WarningText;
