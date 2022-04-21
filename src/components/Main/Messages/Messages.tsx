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
        <React.Fragment>
          <ChatRoom toggleModal={toggleModal} />
          <Chats toggleModal={toggleModal} hide={true} />
        </React.Fragment>
      ) : null}
      {width < 768 && !selectedChat ? (
        <Chats toggleModal={toggleModal} hide={false} />
      ) : null}
      {width >= 768 ? (
        <React.Fragment>
          <Chats toggleModal={toggleModal} smallerChatRoom={true} />{" "}
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
  @media only screen and (min-width: 768px) {
    position: static;
    height: calc(100vh - 55px);
    width: 100%;
    grid-template-columns: 350px 1fr;
    border: 1px solid ${({ theme }) => theme.palette.common.grey};
    border-top: none;
  }
  @media only screen and (min-width: 1024px) {
    height: calc(100vh - 55px - 5rem);
    border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
    width: 1100px;
    margin: 0 auto;
    margin-top: 2rem;
  }
`;

export default Messages;
