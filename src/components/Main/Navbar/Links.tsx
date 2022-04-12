import { Link } from "react-router-dom";
import FlexContainer from "../../utils/FlexContainer";
import { AiOutlineHome, AiFillHome, AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillChatFill, BsChat, BsPerson, BsPersonFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getAuth } from "firebase/auth";
interface IProps {
  toggleAddPostModal: (e: React.MouseEvent) => void;
}
const Links = ({ toggleAddPostModal }: IProps) => {
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
      <StyledLink to="/search">{<FiSearch />}</StyledLink>
      <AiOutlinePlusCircle onClick={toggleAddPostModal} />
      <StyledLink to="/chats">
        {location.pathname.includes("chats") ? <BsFillChatFill /> : <BsChat />}
      </StyledLink>

      <StyledLink to={`/profile/${getAuth().currentUser!.uid}`}>
        {location.pathname.includes(
          `profile/${getAuth()!.currentUser!.uid}`
        ) ? (
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
  z-index: 25;
  justify-content: space-evenly;
  border-top: 1px solid ${({ theme }) => theme.palette.neutral};
  padding: 2rem 0rem;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  @media only screen and (min-width: 768px) {
    position: static;
    border-top: none;
    padding: 0rem 2rem;
    align-items: center;
    justify-content: start;
    gap: 3rem;
    z-index: 0;
    a:nth-child(2) {
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
