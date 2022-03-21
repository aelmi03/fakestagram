import { Link } from "react-router-dom";
import FlexContainer from "../../utils/FlexContainer";
import { AiOutlineHome, AiFillHome, AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillChatFill, BsChat, BsPerson, BsPersonFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Links = () => {
  const location = useLocation();
  return (
    <LinksContainer direction="row" gap="0.5rem">
      <StyledLink to="/home">
        {location.pathname.includes("home") ? (
          <AiFillHome />
        ) : (
          <AiOutlineHome />
        )}
      </StyledLink>
      <StyledLink to="/chats">
        {location.pathname.includes("chats") ? <BsFillChatFill /> : <BsChat />}
      </StyledLink>

      <StyledLink to="/search">{<FiSearch />}</StyledLink>
      <AiOutlinePlusCircle />

      <StyledLink to="/profile">
        {location.pathname.includes("profile") ? (
          <BsPersonFill />
        ) : (
          <BsPerson />
        )}
      </StyledLink>
    </LinksContainer>
  );
};
const LinksContainer = styled(FlexContainer)`
  svg {
    height: 24px;
    width: 24px;
    color: black;
  }
  * {
    cursor: pointer;
  }
  position: fixed;
  bottom: 0;
  width: 100%;
  justify-content: space-evenly;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  padding: 2rem 0rem;
  @media only screen and (min-width: 768px) {
    position: static;
    border-top: none;
    padding: 0rem;
    align-items: center;
    gap: 3rem;
    a:nth-child(3) {
      display: none;
    }
  }
`;
const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default Links;
