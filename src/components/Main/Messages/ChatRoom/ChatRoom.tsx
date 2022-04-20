import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
import ReturnBack from "../../../utils/ReturnBack";
import FlexContainer from "../../../utils/FlexContainer";
interface IProps {
  toggleModal: () => void;
}
const ChatRoom = ({ toggleModal }: IProps) => {
  const selectedChat = useAppSelector(getSelectedChat);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);
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
  return (
    <ChatRoomContainer>
      <ReturnBack
        staticPositioning={true}
        onClick={unselectChat}
        profilePicture={`${getOtherUser()?.profilePicture}`}
        name={`${getOtherUser()?.fullName}`}
      />
      <FlexContainer direction="column" padding="1rem" gap="2rem">
        <ChatMessagesContainer></ChatMessagesContainer>
        <SendBox>
          <MessageTextArea placeholder="Message..." rows={2} cols={26} />
          <BasicText
            color="blue"
            fontWeight="600"
            fontSize="1.3rem"
            fadeText={true}
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
`;
const ChatMessagesContainer = styled.div`
  display: grid;
  flex-grow: 1;
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
export default ChatRoom;
