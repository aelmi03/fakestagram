import styled from "styled-components";

const Heading = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  font-family: "Dancing Script", cursive;
  color: ${({ theme }) => theme.palette.common.black};
`;

export default Heading;
