import styled from "styled-components";
import Chats from "./Chats";
import React, { useState } from "react";
import NewMessageModal from "./NewMessageModal";

const Messages = () => {
  const [modalStatus, setModalStatus] = useState(false);
  const toggleModal = () => {
    setModalStatus((prevBoolean) => !prevBoolean);
  };
  return (
    <MessagesWrapper>
      <Chats toggleModal={toggleModal} />
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
