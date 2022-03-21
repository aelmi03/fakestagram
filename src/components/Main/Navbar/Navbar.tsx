import styled from "styled-components";
import Heading from "../../utils/Heading";
import Links from "./Links";

const Navbar = () => {
  return (
    <NavbarWrapper>
      <NavbarHeading>Fakestagram</NavbarHeading>
      <Links />
    </NavbarWrapper>
  );
};
const NavbarWrapper = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;

  padding: 2rem;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
  background-color: ${({ theme }) => theme.palette.primaryLight};
`;
const NavbarHeading = styled(Heading)`
  font-size: 2.8rem;
`;
export default Navbar;
