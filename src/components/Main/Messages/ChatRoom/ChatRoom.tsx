import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  changeSelectedChat,
  getSelectedChat,
} from "../../../../features/chatRooms/chatRoomsSlice";
import {
  selectAllUsers,
  selectUser,
} from "../../../../features/user/userSlice";
import ReturnBack from "../../../utils/ReturnBack";
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
      <h1>Chat Room</h1>
    </ChatRoomContainer>
  );
};
const ChatRoomContainer = styled.div``;
export default ChatRoom;
