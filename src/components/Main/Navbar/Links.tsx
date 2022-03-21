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
      <Link to="/home">
        {location.pathname.includes("home") ? (
          <AiFillHome />
        ) : (
          <AiOutlineHome />
        )}
      </Link>
      <Link to="/chats">
        {location.pathname.includes("chats") ? <BsFillChatFill /> : <BsChat />}
      </Link>
      <FiSearch onClick={() => console.log("5")} />
      <AiOutlinePlusCircle />

      <Link to="/profile">
        {location.pathname.includes("profile") ? (
          <BsPersonFill />
        ) : (
          <BsPerson />
        )}
      </Link>
    </LinksContainer>
  );
};
const LinksContainer = styled(FlexContainer)`
  svg {
    height: 25px;
    width: 25px;
    color: black;
  }
  position: fixed;
  bottom: 0;
  width: 100%;
  justify-content: space-evenly;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  padding: 2rem 0rem;
`;
export default Links;
