import { Link } from "react-router-dom";
import FlexContainer from "../../utils/FlexContainer";
import { AiOutlineHome, AiFillHome, AiOutlinePlusCircle } from "react-icons/ai";
import { BsFillChatFill, BsChat, BsPerson, BsPersonFill } from "react-icons/bs";
import { MdOutlineExplore, MdExplore } from "react-icons/md";
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
      <StyledLink to="/home" data-testid="Home Link">
        {location.pathname.includes("home") ? (
          <AiFillHome data-testid="Filled Home Icon" />
        ) : (
          <AiOutlineHome data-testid="Unfilled Home Icon" />
        )}
      </StyledLink>
      <StyledLink to="/search" data-testid="Search Link">
        {<FiSearch />}
      </StyledLink>
      <AiOutlinePlusCircle
        onClick={toggleAddPostModal}
        data-testid="Add Post Icon"
      />
      <StyledLink to="/chats" data-testid="Chats Link">
        {location.pathname.includes("chats") ? (
          <BsFillChatFill data-testid="Filled Chats Icon" />
        ) : (
          <BsChat data-testid="Unfilled Chats Icon" />
        )}
      </StyledLink>
      <StyledLink to="/explore" data-testid="Explore Link">
        {location.pathname.includes("explore") ? (
          <MdExplore data-testid="Filled Explore Icon" />
        ) : (
          <MdOutlineExplore data-testid="Unfilled Explore Icon" />
        )}
      </StyledLink>

      <StyledLink
        to={`/profile/${getAuth().currentUser!.uid}`}
        data-testid="Profile Link"
      >
        {location.pathname.includes(
          `profile/${getAuth()!.currentUser!.uid}`
        ) ? (
          <BsPersonFill data-testid="Filled Profile Icon" />
        ) : (
          <BsPerson data-testid="Unfilled Profile Icon" />
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
  z-index: 31;
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
