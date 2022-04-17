import styled from "styled-components";
import Chats from "./Chats";

const Messages = () => {
  return (
    <MessagesWrapper>
      <Chats />
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

export default Messages;
