import { useNavigate } from "react-router-dom";
import { BasicText } from "../../../utils/Texts";
import styled from "styled-components";
import ReturnBack from "../../../utils/ReturnBack";
import FlexContainer from "../../../utils/FlexContainer";
import CircularUserImage from "../../../utils/CircularUserImage";
import { useAppSelector } from "../../../../app/hooks";
import {
  selectChats,
  RecentMessage,
} from "../../../../features/chatRoom/chatRoomSlice";
import { useEffect, useState } from "react";
import { selectUser, User } from "../../../../features/user/userSlice";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
interface IProps {
  toggleModal: () => void;
}
interface ChatRoom {
  otherUser: User;
  recentMessage: RecentMessage;
  id: string;
}
const Chats = ({ toggleModal }: IProps) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [users, setUsers] = useState<User[]>([]);
  const chats = useAppSelector(selectChats);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const getOtherUser = (id: string) => {
    return users.filter((user) => user.id === id)[0];
  };
  useEffect(() => {
    const getUsers = async () => {
      const usersQuery = query(collection(getFirestore(), "users"));
      const allUsers = (await getDocs(usersQuery)).docs.map(
        (doc) => doc.data() as User
      );
      setUsers(allUsers);
    };
    getUsers();
  }, []);
  useEffect(() => {
    const initializeChatRooms = async () => {
      console.log("chat rooms forrrreaallll");
      const newChatRooms = await Promise.all(
        chats.map(async (chat) => {
          const otherUserID =
            chat.members[0] === user.id ? chat.members[1] : chat.members[0];
          let otherUser: User;
          if (users.length === 0) {
            console.log("GETTING USER DATA IN CHATS");
            const otherUserDoc = doc(getFirestore(), `users/${otherUserID}`);
            otherUser = (await getDoc(otherUserDoc)).data() as User;
          } else {
            otherUser = getOtherUser(otherUserID);
          }
          const chatRoom: ChatRoom = {
            otherUser,
            id: chat.id,
            recentMessage: chat.recentMessage,
          };
          return chatRoom;
        })
      );
      setChatRooms(newChatRooms);
    };
    initializeChatRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  return (
    <MessagesContainer>
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
      <FlexContainer direction="column">
        {chatRooms.map((chatRoom) => (
          <FlexContainer
            direction="row"
            gap="1rem"
            alignItems="center"
            padding="0.5rem 1rem"
            key={chatRoom.id}
          >
            <CircularUserImage
              size="56px"
              src={chatRoom.otherUser.profilePicture}
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
                >
                  <RecentTextContainer>
                    <BasicText
                      fontSize="1.3rem"
                      fontWeight="400"
                      color="grey"
                      ellipseText={true}
                    >
                      {chatRoom.recentMessage.content}
                    </BasicText>
                  </RecentTextContainer>
                  <BasicText
                    fontSize="1.2rem"
                    fontWeight="400"
                    color="grey"
                    wrap={false}
                  >
                    {formatDistanceToNow(
                      new Date(chatRoom.recentMessage.timestamp)
                    )}
                  </BasicText>
                </FlexContainer>
              ) : null}
            </FlexContainer>
          </FlexContainer>
        ))}
      </FlexContainer>
    </MessagesContainer>
  );
};
const MessagesContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 1.1rem;
  width: 100%;
`;
const RecentTextContainer = styled.div`
  max-width: 130px;
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
`;
export default Chats;
