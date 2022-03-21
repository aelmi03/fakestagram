import styled from "styled-components";
import Heading from "../../utils/Heading";
import Links from "./Links";
import StyledInput from "../../SignUpAndLogin/StyledInput";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/profile/${getAuth().currentUser!.uid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NavbarWrapper>
      <NavbarHeading>Fakestagram</NavbarHeading>
      <NavbarInput placeholder="🔍 Search" />
      <Links />
    </NavbarWrapper>
  );
};
const NavbarWrapper = styled.nav`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  padding: 1rem 0rem;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
  background-color: ${({ theme }) => theme.palette.primaryLight};
  @media only screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 3.5rem;
  }
  @media only screen and (min-width: 1024px) {
    gap: 1rem;
  }
`;
const NavbarHeading = styled(Heading)`
  font-size: 2.8rem;
`;

const NavbarInput = styled(StyledInput)`
  background-color: ${({ theme }) => theme.palette.darkGrey};
  font-size: 1.4rem;
  border-radius: 5px;
  padding: 0rem 2rem;
  width: min(100%, 250px);
  display: none;
  border: none;
  @media only screen and (min-width: 768px) {
    display: block;
    padding: 0.8rem 2rem;
  }
`;
export default Navbar;
