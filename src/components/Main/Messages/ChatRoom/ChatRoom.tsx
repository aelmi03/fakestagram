import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  changeSelectedChat,
  getSelectedChat,
} from "../../../../features/chatRooms/chatRoomsSlice";
import { BasicText, PostCommentText } from "../../../utils/Texts";
import {
  selectAllUsers,
  selectUser,
} from "../../../../features/user/userSlice";
import { nanoid } from "@reduxjs/toolkit";
import ReturnBack from "../../../utils/ReturnBack";
import { useEffect, useRef, useState } from "react";
import FlexContainer from "../../../utils/FlexContainer";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
interface IProps {
  toggleModal: () => void;
}
const ChatRoom = ({ toggleModal }: IProps) => {
  const selectedChat = useAppSelector(getSelectedChat);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const messagesContainer = useRef<HTMLDivElement>(null);
  const allUsers = useAppSelector(selectAllUsers);
  const [messageValue, setMessageValue] = useState("");
  const getUserByID = (id: string) => {
    return allUsers.find((filteredUser) => filteredUser.id === id);
  };
  const unselectChat = () => {
    dispatch(changeSelectedChat(null));
  };

  const getOtherUser = () => {
    const otherUser =
      selectedChat?.members[0] === user.id
        ? getUserByID(selectedChat!.members[1])
        : getUserByID(selectedChat!.members[0]);
    return otherUser;
  };
  const sendMessage = async () => {
    if (messageValue.replace(/ /g, "").length === 0) return;
    const newMessage = {
      timestamp: new Date().toString(),
      id: nanoid(),
      content: messageValue,
      sentBy: user.id,
    };
    console.log(selectedChat?.messages);
    const newMessages = [...selectedChat!.messages, newMessage];
    console.log(newMessages);
    const chatRoomDoc = doc(getFirestore(), `chatRooms/${selectedChat?.id}`);
    await updateDoc(chatRoomDoc, {
      recentMessage: newMessage,
      messages: newMessages,
    });
    setMessageValue("");
    console.log(selectedChat, "selectedChat");
  };
  useEffect(() => {
    messagesContainer?.current?.scrollTo({
      top:
        messagesContainer?.current?.scrollHeight -
        messagesContainer?.current?.clientHeight,
    });
    console.log(messagesContainer.current);
  }, []);
  return (
    <ChatRoomContainer>
      <ReturnBack
        staticPositioning={true}
        onClick={unselectChat}
        profilePicture={`${getOtherUser()?.profilePicture}`}
        name={`${getOtherUser()?.fullName}`}
      />
      <FlexContainer
        direction="column"
        padding="0rem 1rem 1rem 1rem"
        overflowY="scroll"
      >
        <ChatMessagesContainer
          ref={messagesContainer}
          onClick={() => {
            messagesContainer?.current?.scrollIntoView({
              behavior: "smooth",
            });

            console.log("ello");
          }}
        >
          {selectedChat?.messages.map((message) => (
            <ChatMessage
              ownMessage={message.sentBy === user.id}
              key={message.id}
            >
              {message.content}
            </ChatMessage>
          ))}
        </ChatMessagesContainer>
        <SendBox>
          <MessageTextArea
            placeholder="Message..."
            rows={2}
            cols={26}
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <BasicText
            color="blue"
            fontWeight="600"
            fontSize="1.3rem"
            fadeText={messageValue.replace(/ /g, "").length === 0}
            onClick={() => sendMessage()}
          >
            Send
          </BasicText>
        </SendBox>
      </FlexContainer>
    </ChatRoomContainer>
  );
};
const ChatRoomContainer = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100%;
  max-height: 100%;
  overflow: scroll;
`;
const ChatMessagesContainer = styled.div`
  display: flex;
  align-content: flex-end;
  flex-flow: column nowrap;
  gap: 1rem;
  overflow-y: scroll !important;
  flex-grow: 1;
  padding: 1rem 0rem;
`;
const MessageTextArea = styled.textarea`
  font-size: 1.3rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.primaryFont};
`;
const SendBox = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  padding: 1rem 1.2rem;
  gap: 1.1rem;
  align-items: center;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  width: 100%;
`;
const ChatMessage = styled.div<{ ownMessage: boolean }>`
  padding: 1.1rem 1.3rem;
  font-size: 1.3rem;
  font-family: ${({ theme }) => theme.primaryFont};
  font-weight: 400;
  border-radius: 20px;
  max-width: 70%;
  ${({ ownMessage }) =>
    ownMessage === true &&
    css`
      background-color: ${({ theme }) => theme.palette.secondary.main};
      color: ${({ theme }) => theme.palette.secondary.contrastText};
      align-self: end;
    `};
  ${({ ownMessage }) =>
    ownMessage === false &&
    css`
      background-color: ${({ theme }) => theme.palette.neutral};
      color: ${({ theme }) => theme.palette.common.black};
      align-self: start;
    `};
`;
export default ChatRoom;
