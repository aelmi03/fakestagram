import styled from "styled-components";
import Chats from "./Chats";
import { useAppSelector } from "../../../app/hooks";
import { getSelectedChat } from "../../../features/chatRooms/chatRoomsSlice";
import React, { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import NewMessageModal from "./NewMessageModal";

const Messages = () => {
  const [modalStatus, setModalStatus] = useState(false);
  const selectedChat = useAppSelector(getSelectedChat);
  const toggleModal = () => {
    setModalStatus((prevBoolean) => !prevBoolean);
  };
  const [width, setWidth] = useState(window.innerWidth);

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
    <MessagesWrapper>
      {width < 768 && selectedChat ? (
        <ChatRoom toggleModal={toggleModal} />
      ) : null}
      {width < 768 && !selectedChat ? (
        <Chats toggleModal={toggleModal} />
      ) : null}
      {width >= 768 ? (
        <React.Fragment>
          <Chats toggleModal={toggleModal} />{" "}
          <ChatRoom toggleModal={toggleModal} />
        </React.Fragment>
      ) : null}
      {modalStatus === true ? (
        <NewMessageModal toggleModal={toggleModal} />
      ) : null}
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
