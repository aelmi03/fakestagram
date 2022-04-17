import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReturnBack from "../../../utils/ReturnBack";

const Chats = () => {
  const navigate = useNavigate();
  return (
    <MessagesContainer>
      <ReturnBack
        staticPositioning={true}
        onClick={() => navigate("/home", { replace: true })}
        onChatIconClick={() => {}}
        name="Chats"
      />
    </MessagesContainer>
  );
};
const MessagesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
`;
export default Chats;
