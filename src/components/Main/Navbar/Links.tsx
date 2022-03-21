import { Link } from "react-router-dom";
import FlexContainer from "../../utils/FlexContainer";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsFillChatFill, BsChat, BsPerson, BsPersonFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";

const Links = () => {
  const location = useLocation();
  return (
    <FlexContainer direction="row" gap="0.5rem">
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
      <Link to="/profile">
        {location.pathname.includes("profile") ? (
          <BsPersonFill />
        ) : (
          <BsPerson />
        )}
      </Link>
    </FlexContainer>
  );
};

export default Links;
