import styled from "styled-components";

const HorizontalLine = styled.hr`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
`;

export default HorizontalLine;
