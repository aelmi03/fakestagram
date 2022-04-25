import { useNavigate } from "react-router-dom";
import { BasicText } from "../../../utils/Texts";
import styled, { css } from "styled-components";
import ReturnBack from "../../../utils/ReturnBack";
import FlexContainer from "../../../utils/FlexContainer";
import CircularUserImage from "../../../utils/CircularUserImage";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectChats,
  RecentMessage,
  getSelectedChat,
  changeSelectedChat,
  Chat,
} from "../../../../features/chatRooms/chatRoomsSlice";
import Button from "../../../utils/Button";
import { useEffect, useState } from "react";
import { selectUser, User } from "../../../../features/user/userSlice";
import { selectAllUsers } from "../../../../features/users/usersSlice";

import { formatDistanceToNow } from "date-fns";
interface IProps {
  toggleModal: () => void;
  hide?: boolean;
}
interface ChatRoom {
  otherUser: User;
  recentMessage: RecentMessage;
  chat: Chat;
}
const Chats = ({ toggleModal, hide }: IProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectAllUsers);
  const selectedChat = useAppSelector(getSelectedChat);
  const chats = useAppSelector(selectChats);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const getOtherUser = (id: string) => {
    return users.filter((user) => user.id === id)[0];
  };
  const onChatRoomClick = (clickedChatRoom: ChatRoom) => {
    dispatch(changeSelectedChat(clickedChatRoom.chat));
  };
  useEffect(() => {
    const initializeChatRooms = () => {
      console.log("chat rooms forrrreaallll");
      const newChatRooms = [...chats]
        .sort((a, b) => {
          if (a.recentMessage && b.recentMessage) {
            return (
              new Date(b.recentMessage.timestamp).getTime() -
              new Date(a.recentMessage.timestamp).getTime()
            );
          } else {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        })
        .map((chat) => {
          const otherUserID =
            chat.members[0] === user.id ? chat.members[1] : chat.members[0];
          const otherUser = getOtherUser(otherUserID);
          if (
            selectedChat &&
            chat.id === selectedChat.id &&
            selectedChat?.messages.length !== chat.messages.length
          ) {
            console.log("chat matched");
            dispatch(changeSelectedChat(chat));
          }
          const chatRoom: ChatRoom = {
            otherUser,
            recentMessage: chat.recentMessage,
            chat,
          };
          return chatRoom;
        });

      setChatRooms(newChatRooms);
    };
    initializeChatRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  return (
    <MessagesContainer hide={hide} data-testid="Chats Wrapper">
      <ReturnBack
        staticPositioning={true}
        onClick={() => navigate("/home", { replace: true })}
        onChatIconClick={toggleModal}
        name="Chats"
      />
      <FlexContainer direction="row" padding="0rem 1.6rem">
        <BasicText fontWeight="600" fontSize="1.6rem">
          Messages
        </BasicText>
      </FlexContainer>
      {chats.length !== 0 ? (
        <FlexContainer
          direction="column"
          overflowY="scroll"
          data-testid="Chats Container"
        >
          {chatRooms.map((chatRoom) => (
            <ChatRoomContainer
              key={chatRoom.chat.id}
              data-testid={`${chatRoom.chat.id}`}
              selected={chatRoom.chat.id === selectedChat?.id}
              onClick={() => onChatRoomClick(chatRoom)}
            >
              <CircularUserImage
                size="56px"
                src={chatRoom.otherUser.profilePicture}
                data-testid="Profile Picture"
              />
              <FlexContainer direction="column" gap="0.2rem">
                <BasicText fontSize="1.3rem" fontWeight="500">
                  {chatRoom.otherUser.fullName}
                </BasicText>
                {chatRoom.recentMessage ? (
                  <FlexContainer
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="0.3rem"
                  >
                    <RecentTextContainer>
                      <BasicText
                        fontSize="1.3rem"
                        fontWeight={
                          chatRoom.recentMessage.read === false &&
                          chatRoom.recentMessage.sentBy !== user.id
                            ? "600"
                            : "500"
                        }
                        color={
                          chatRoom.recentMessage.read === false &&
                          chatRoom.recentMessage.sentBy !== user.id
                            ? "black"
                            : "grey"
                        }
                        ellipseText={true}
                      >
                        {chatRoom.recentMessage.content}
                      </BasicText>
                    </RecentTextContainer>
                    <BasicText
                      fontSize="1.2rem"
                      fontWeight="400"
                      color="grey"
                      wrapText={false}
                    >
                      {formatDistanceToNow(
                        new Date(chatRoom.recentMessage.timestamp)
                      )}
                    </BasicText>
                  </FlexContainer>
                ) : null}
              </FlexContainer>
            </ChatRoomContainer>
          ))}
        </FlexContainer>
      ) : (
        <NoMessagesContainer>
          <BasicText fontSize="2rem" fontWeight="400">
            No Messages
          </BasicText>
          <Button onClick={toggleModal}>Start a Message</Button>
        </NoMessagesContainer>
      )}
    </MessagesContainer>
  );
};
const MessagesContainer = styled.div<{ hide?: boolean }>`
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  gap: 1.1rem;
  height: 100%;
  width: 100%;
  ${({ hide }) =>
    hide === true &&
    css`
      display: none;
    `}
  @media only screen and (min-width: 768px) {
    border-right: 1px solid ${({ theme }) => theme.palette.common.grey};
  }
`;
const ChatRoomContainer = styled.div<{ selected: boolean }>`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.neutral};
  }
  ${({ selected }) =>
    selected === true &&
    css`
      background-color: ${({ theme }) => theme.palette.neutral};
    `}
`;
const NoMessagesContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  justify-items: center;
  align-content: center;
  height: 100%;
`;
const RecentTextContainer = styled.div`
  max-width: 115px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media only screen and (min-width: 400px) {
    max-width: 250px;
  }
  @media only screen and (min-width: 450px) {
    max-width: 300px;
  }
  @media only screen and (min-width: 500px) {
    max-width: 350px;
  }
  @media only screen and (min-width: 550px) {
    max-width: 400px;
  }
  @media only screen and (min-width: 600px) {
    max-width: 450px;
  }
  @media only screen and (min-width: 650px) {
    max-width: 500px;
  }
  @media only screen and (min-width: 700px) {
    max-width: 550px;
  }
  @media only screen and (min-width: 750px) {
    max-width: 600px;
  }
  @media only screen and (min-width: 768px) {
    max-width: 140px;
  }
`;
export default Chats;
