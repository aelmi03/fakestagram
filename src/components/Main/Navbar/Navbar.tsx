import styled, { css } from "styled-components";
import Heading from "../../utils/Heading";
import Links from "./Links";
import { useEffect, useState } from "react";
import Search from "./Search";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import React from "react";
import AddPostModal from "./AddPostModal";

const Navbar = () => {
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const location = useLocation();
  console.log(location, "LOCATION!");
  const toggleAddPostModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddPostModal((prevBoolean) => !prevBoolean);
  };
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/profile/${getAuth().currentUser!.uid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);

    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  return (
    <React.Fragment>
      <NavbarWrapper>
        <NavbarContainer
          hide={width <= 768 && location.pathname.includes("search")}
        >
          {width <= 768 && location.pathname.includes("search") ? null : (
            <NavbarHeading>Fakestagram</NavbarHeading>
          )}
          {width >= 768 ? <Search /> : null}
          {width >= 768 && <Links toggleAddPostModal={toggleAddPostModal} />}
        </NavbarContainer>
      </NavbarWrapper>
      {showAddPostModal ? (
        <AddPostModal toggleAddPostModal={toggleAddPostModal} />
      ) : (
        width < 768 && <Links toggleAddPostModal={toggleAddPostModal} />
      )}
    </React.Fragment>
  );
};
const NavbarContainer = styled.nav<{ hide: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  padding: 1rem 0rem;
  width: 100%;
  max-width: 935px;
  z-index: 15;
  ${({ hide }) =>
    hide === true &&
    css`
      padding: 0rem;
    `}
  @media only screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 3.5rem;
  }
  @media only screen and (min-width: 1024px) {
    gap: 1rem;
  }
`;
const NavbarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: sticky;
  top: 0;
  z-index: 9;
  @media only screen and (min-width: 1024px) {
  }
`;
const NavbarHeading = styled(Heading)`
  font-size: 2.8rem;
`;

export default Navbar;
