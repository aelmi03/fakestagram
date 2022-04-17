import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReturnBack from "../../utils/ReturnBack";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <MessagesWrapper>
      <MessagesContainer>
        <ReturnBack
          stickyPositioning={true}
          onClick={() => navigate("/home", { replace: true })}
          onChatIconClick={() => {}}
          name="Chats"
        />
      </MessagesContainer>
    </MessagesWrapper>
  );
};
const MessagesWrapper = styled.div`
  display: grid;
  position: fixed;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
`;
const MessagesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;
export default Messages;
