import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  changeSelectedChat,
  getSelectedChat,
  RecentMessage,
  Message,
} from "../../../../features/chatRooms/chatRoomsSlice";
import { BasicText } from "../../../utils/Texts";
import { selectUser, User } from "../../../../features/user/userSlice";
import { selectAllUsers } from "../../../../features/users/usersSlice";
import { nanoid } from "@reduxjs/toolkit";
import { FiSend } from "react-icons/fi";
import ReturnBack from "../../../utils/ReturnBack";
import { useEffect, useRef, useState } from "react";
import FlexContainer from "../../../utils/FlexContainer";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import Button from "../../../utils/Button";
interface IProps {
  toggleModal: () => void;
}
const ChatRoom = ({ toggleModal }: IProps) => {
  const selectedChat = useAppSelector(getSelectedChat);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const messagesContainer = useRef<HTMLDivElement>(null);
  const allUsers = useAppSelector(selectAllUsers);

  const [messageValue, setMessageValue] = useState("");
  const getUserByID = (id: string) => {
    return allUsers.find((filteredUser) => filteredUser.id === id);
  };
  const unselectChat = () => {
    dispatch(changeSelectedChat(null));
  };
  const onChatAccountClicked = (chatAccount: User) => {
    navigate(`/profile/${chatAccount.id}`, { replace: true });
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
    const newMessage: Message = {
      timestamp: new Date().toString(),
      id: nanoid(),
      content: messageValue,
      sentBy: user.id,
    };
    const recentMessage: RecentMessage = {
      ...newMessage,
      read: false,
    };
    console.log(selectedChat?.messages);
    const newMessages = [...selectedChat!.messages, newMessage];
    console.log(newMessages);
    const chatRoomDoc = doc(getFirestore(), `chatRooms/${selectedChat?.id}`);
    await updateDoc(chatRoomDoc, {
      recentMessage,
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
  useEffect(() => {
    const changeRecentMessageStatus = async () => {
      const chatRoomDoc = doc(getFirestore(), `chatRooms/${selectedChat!.id}`);
      updateDoc(chatRoomDoc, {
        recentMessage: {
          ...selectedChat!.recentMessage,
          read: true,
        },
      });
    };
    if (!selectedChat || selectedChat.recentMessage === null) return;
    const recentMessage = selectedChat.recentMessage;
    if (recentMessage.read === false && recentMessage.sentBy !== user.id) {
      changeRecentMessageStatus();
    }
  }, [selectedChat, user.id]);
  return selectedChat ? (
    <ChatRoomContainer data-testid="ChatRoom Container">
      <ReturnBack
        staticPositioning={true}
        onClick={unselectChat}
        user={getOtherUser()}
        name={`${getOtherUser()?.fullName}`}
        onChatAccountClicked={onChatAccountClicked}
      />
      <FlexContainer
        direction="column"
        padding="0rem 1rem 1rem 1rem"
        maxHeight="100%"
      >
        <ChatMessagesContainer
          ref={messagesContainer}
          data-testid="ChatMessages Container"
          onClick={() => {
            messagesContainer?.current?.scrollIntoView({
              behavior: "smooth",
            });

            console.log("ello");
          }}
        >
          {[...selectedChat!.messages].reverse().map((message) => (
            <ChatMessage
              ownMessage={message.sentBy === user.id}
              key={message.id}
              data-testid={message.id}
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
            cursor="pointer"
          >
            Send
          </BasicText>
        </SendBox>
      </FlexContainer>
    </ChatRoomContainer>
  ) : (
    <NoSelectedChatContainer data-testid="NoSelectedChat Container">
      <IconContainer>
        <FiSend />
      </IconContainer>
      <BasicText fontSize="2.3rem" fontWeight="500">
        Your Messages
      </BasicText>
      <BasicText fontSize="1.4rem" fontWeight="500" color="grey">
        Send messages to a friend.
      </BasicText>
      <Button onClick={() => toggleModal()}>Send Message</Button>
    </NoSelectedChatContainer>
  );
};
const ChatRoomContainer = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100%;
  max-height: 100%;
`;
const ChatMessagesContainer = styled.div`
  display: flex;
  flex-flow: column-reverse nowrap;
  gap: 1rem;
  overflow-y: scroll !important;
  flex-grow: 1;
  padding: 1rem 0rem;
  height: 0px;
`;
const MessageTextArea = styled.textarea`
  font-size: 1.3rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.primaryFont};
`;
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.palette.primary.contrastText};
  svg {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    height: 50px;
    width: 50px;
  }
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
const NoSelectedChatContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  > :last-child {
    margin-top: 2rem;
  }
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
