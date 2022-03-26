import styled from "styled-components";

const HorizontalLine = styled.hr`
  width: 100%;
  color: ${({ theme }) => theme.palette.common.grey};
  height: 2px;
`;

export default HorizontalLine;
